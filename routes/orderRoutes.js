const express = require('express');
const router = express.Router();
const { getAllOrders } = require('../controllers/orderController');

router.get('/', getAllOrders); // termina siendo /api/orders

module.exports = router;
