const express = require('express');
const router = express.Router();
const { getAllOrders } = require('../controllers/orderController');
const requireAuth = require('../middleware/auth');
router.get('/', requireAuth, getAllOrders); // termina siendo /api/orders
module.exports = router;
