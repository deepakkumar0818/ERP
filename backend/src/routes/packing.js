const express = require('express');
const router = express.Router();
const {
  createPacking,
  getPackingByJobOrder,
} = require('../controllers/packingController');

router.post('/create', createPacking);
router.get('/get/:jobOrderId', getPackingByJobOrder);

module.exports = router;
