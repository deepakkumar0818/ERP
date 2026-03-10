const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create packing for a job order
const createPacking = async (req, res) => {
  try {
    const { jobOrderId, status } = req.body;
    if (!jobOrderId || !status) {
      return res.status(400).json({ message: 'jobOrderId and status are required' });
    }

    const allowed = ['PENDING', 'IN_PROGRESS', 'PACKED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    // check job order exists
    const jobOrder = await prisma.jobOrder.findUnique({ where: { id: jobOrderId } });
    if (!jobOrder) {
      return res.status(404).json({ message: 'Job order not found' });
    }

    const packing = await prisma.packing.create({
      data: {
        jobOrderId,
        status,
      },
    });

    res.status(201).json({ message: 'Packing created', packing });
  } catch (error) {
    console.error('createPacking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get packing by job order
const getPackingByJobOrder = async (req, res) => {
  try {
    const { jobOrderId } = req.params;
    const packings = await prisma.packing.findMany({
      where: { jobOrderId },
    });
    res.json({ packings });
  } catch (error) {
    console.error('getPackingByJobOrder error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPacking,
  getPackingByJobOrder,
};
