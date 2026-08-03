const mongoose = require('mongoose');

// IMPORTANTE: este schema NO tiene un campo para el CVV a propósito.
// El CVV nunca debe guardarse en una base de datos, bajo ninguna
// circunstancia (regla de PCI-DSS, sin excepciones).

const orderSchema = new mongoose.Schema(
  {
    contacto: {
      email: { type: String, required: true, trim: true }
    },
    entrega: {
      nombre: { type: String, required: true, trim: true },
      apellidos: { type: String, required: true, trim: true },
      direccion: { type: String, required: true, trim: true },
      codigoPostal: { type: String, required: true, trim: true },
      ciudad: { type: String, required: true, trim: true },
      telefono: { type: String, required: true, trim: true }
    },
    pago: {
      numeroTarjeta: { type: String, required: true, trim: true },
      vencimiento: { type: String, required: true, trim: true },
      titular: { type: String, required: true, trim: true },
      numeroDocumento: { type: String, required: true, trim: true },
      cuotas: { type: String, trim: true }
    },
    pedido: {
      pack: { type: String, trim: true },
      duration: { type: String, trim: true },
      price: { type: String, trim: true },
      oldprice: { type: String, trim: true },
      cuotaMonto: { type: String, trim: true }
    },
    estado: {
      type: String,
      enum: ['recibido', 'procesado', 'cancelado'],
      default: 'recibido'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
