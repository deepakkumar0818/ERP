const express = require('express');
const router = express.Router();
const {
  addQualityCheck,
  getQualityChecksByJobOrder,
} = require('../controllers/qualityCheckController');

router.post('/add', addQualityCheck);
router.get('/get/:jobOrderId', getQualityChecksByJobOrder);

module.exports = router;
