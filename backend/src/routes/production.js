const express = require('express');
const router = express.Router();
const {
  createSalesOrder,
  addBOM,
  getBOMByProduct,
} = require('../controllers/productionController');

// Sales order creation
router.post('/sales-orders', createSalesOrder);

// BOM management
router.post('/bom', addBOM);
router.get('/bom/:productId', getBOMByProduct);

module.exports = router;