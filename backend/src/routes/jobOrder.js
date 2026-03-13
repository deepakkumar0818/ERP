const express = require('express');
const router = express.Router();
const {
  createJobOrder,
  getJobOrdersBySalesOrder,
  getJobOrderById,
  updateJobOrderStatus,
  getAllJobOrders,
} = require('../controllers/jobOrderController');

router.post('/create-job-order', createJobOrder);
router.get('/getall', getAllJobOrders);
router.get('/get-job-orders/:salesOrderId', getJobOrdersBySalesOrder);
router.get('/get-job-order/:id', getJobOrderById);
router.put('/update-status/:id', updateJobOrderStatus);

module.exports = router;
