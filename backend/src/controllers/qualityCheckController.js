const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add quality check to a job order
const addQualityCheck = async (req, res) => {
  try {
    const { jobOrderId, status, remarks } = req.body;
    if (!jobOrderId || !status) {
      return res.status(400).json({ message: 'jobOrderId and status are required' });
    }

    const allowed = ['PASSED', 'FAILED', 'PENDING'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }

    // check job order exists
    const jobOrder = await prisma.jobOrder.findUnique({ where: { id: jobOrderId } });
    if (!jobOrder) {
      return res.status(404).json({ message: 'Job order not found' });
    }

    const qualityCheck = await prisma.qualityCheck.create({
      data: {
        jobOrderId,
        status,
        remarks: remarks || null,
      },
    });

    res.status(201).json({ message: 'Quality check added', qualityCheck });
  } catch (error) {
    console.error('addQualityCheck error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all quality checks for a job order
const getQualityChecksByJobOrder = async (req, res) => {
  try {
    const { jobOrderId } = req.params;
    const checks = await prisma.qualityCheck.findMany({
      where: { jobOrderId },
    });
    res.json({ qualityChecks: checks });
  } catch (error) {
    console.error('getQualityChecksByJobOrder error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addQualityCheck,
  getQualityChecksByJobOrder,
};