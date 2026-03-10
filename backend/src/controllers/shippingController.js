const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create shipping for a sales order
const createShipping = async (req, res) => {
  try {
    const { salesOrderId, carrier, trackingNo } = req.body;
    if (!salesOrderId || !carrier) {
      return res.status(400).json({ message: 'salesOrderId and carrier are required' });
    }

    // check sales order exists
    const salesOrder = await prisma.salesOrder.findUnique({ where: { id: salesOrderId } });
    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }

    const shipping = await prisma.shipping.create({
      data: {
        salesOrderId,
        carrier,
        trackingNo: trackingNo || null,
      },
    });

    res.status(201).json({ message: 'Shipping created', shipping });
  } catch (error) {
    console.error('createShipping error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update shipping status
const updateShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    const shipping = await prisma.shipping.update({
      where: { id },
      data: { status },
    });

    res.json({ message: 'Shipping status updated', shipping });
  } catch (error) {
    console.error('updateShippingStatus error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Shipping not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get shipping by sales order
const getShippingBySalesOrder = async (req, res) => {
  try {
    const { salesOrderId } = req.params;
    const shippings = await prisma.shipping.findMany({
      where: { salesOrderId },
    });
    res.json({ shippings });
  } catch (error) {
    console.error('getShippingBySalesOrder error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark delivery
const createDelivery = async (req, res) => {
  try {
    const { shippingId } = req.body;
    if (!shippingId) {
      return res.status(400).json({ message: 'shippingId is required' });
    }

    // check shipping exists
    const shipping = await prisma.shipping.findUnique({ where: { id: shippingId } });
    if (!shipping) {
      return res.status(404).json({ message: 'Shipping not found' });
    }

    const delivery = await prisma.delivery.create({
      data: {
        shippingId,
        status: 'DELIVERED',
        deliveredAt: new Date(),
      },
    });

    res.status(201).json({ message: 'Delivery marked', delivery });
  } catch (error) {
    console.error('createDelivery error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createShipping,
  updateShippingStatus,
  getShippingBySalesOrder,
  createDelivery,
};
