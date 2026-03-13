const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a job order from a sales order
const createJobOrder = async (req, res) => {
  try {
    const { salesOrderId, productId, quantity } = req.body;
    if (!salesOrderId || !productId || quantity == null) {
      return res.status(400).json({ message: 'salesOrderId, productId and quantity are required' });
    }

    // check sales order exists
    const salesOrder = await prisma.salesOrder.findUnique({ where: { id: salesOrderId } });
    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }

    // check product exists in inventory
    const product = await prisma.inventory.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in inventory' });
    }

    const jobOrder = await prisma.jobOrder.create({
      data: {
        salesOrderId,
        productId,
        quantity: parseFloat(quantity),
      },
    });

    res.status(201).json({ message: 'Job order created', jobOrder });
  } catch (error) {
    console.error('createJobOrder error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all job orders for a sales order
const getJobOrdersBySalesOrder = async (req, res) => {
  try {
    const { salesOrderId } = req.params;
    const jobOrders = await prisma.jobOrder.findMany({
      where: { salesOrderId },
    });
    res.json({ jobOrders });
  } catch (error) {
    console.error('getJobOrdersBySalesOrder error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get single job order by id
const getJobOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobOrder = await prisma.jobOrder.findUnique({
      where: { id },
    });
    if (!jobOrder) {
      return res.status(404).json({ message: 'Job order not found' });
    }
    res.json({ jobOrder });
  } catch (error) {
    console.error('getJobOrderById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update job order status
const updateJobOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const jobOrder = await prisma.jobOrder.update({
      where: { id },
      data: { status },
    });

    res.json({ message: 'Job order status updated', jobOrder });
  } catch (error) {
    console.error('updateJobOrderStatus error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Job order not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all job orders
const getAllJobOrders = async (_req, res) => {
  try {
    const jobOrders = await prisma.jobOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ jobOrders });
  } catch (error) {
    console.error('getAllJobOrders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createJobOrder,
  getJobOrdersBySalesOrder,
  getJobOrderById,
  updateJobOrderStatus,
  getAllJobOrders,
};
