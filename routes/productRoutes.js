const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productController');

router.get('/', getAllProducts); // esto termina siendo /api/products

module.exports = router;
