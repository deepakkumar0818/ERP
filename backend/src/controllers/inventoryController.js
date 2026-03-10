const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create inventory item
const createInventory = async (req, res) => {
  try {
    const { name, sku, quantity, unit, type } = req.body;
    if (!name || !sku || !unit) {
      return res.status(400).json({ message: 'name, sku, and unit are required' });
    }

    const item = await prisma.inventory.create({
      data: {
        name,
        sku,
        quantity: quantity ? parseFloat(quantity) : 0,
        unit,
        type: type || 'RAW',
      },
    });

    res.status(201).json({ message: 'Inventory item created', item });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    console.error('createInventory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all inventory items
const getAllInventory = async (req, res) => {
  try {
    const items = await prisma.inventory.findMany();
    res.json({ items });
  } catch (error) {
    console.error('getAllInventory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single inventory item by id
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.inventory.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ item });
  } catch (error) {
    console.error('getInventoryById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
};
