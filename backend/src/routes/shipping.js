const express = require('express');
const router = express.Router();
const {
  createShipping,
  updateShippingStatus,
  getShippingBySalesOrder,
  createDelivery,
} = require('../controllers/shippingController');

router.post('/create', createShipping);
router.put('/update-status/:id', updateShippingStatus);
router.get('/get/:salesOrderId', getShippingBySalesOrder);
router.post('/delivery', createDelivery);

module.exports = router;
