const express = require('express');
const router = express.Router();
const {
  createSalesOrder,
  addBOM,
  getBOMByProduct,
  getAllSalesOrders,
} = require('../controllers/productionController');

// Sales order creation
router.post('/sales-orders', createSalesOrder);
router.get('/sales-orders', getAllSalesOrders);

// BOM management
router.post('/bom', addBOM);
router.get('/bom/:productId', getBOMByProduct);

module.exports = router;