const express = require('express');
const router = express.Router();
const {
  createInventory,
  getAllInventory,
  getInventoryById,
} = require('../controllers/inventoryController');

router.post('/create-inventory', createInventory);
router.get('/getall-inventory', getAllInventory);
router.get('/get-inventory/:id', getInventoryById);

module.exports = router;
