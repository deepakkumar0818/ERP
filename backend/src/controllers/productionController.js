const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a sales order from an approved quotation
const createSalesOrder = async (req, res) => {
  try {
    const { quotationId } = req.body;
    if (!quotationId) {
      return res.status(400).json({ message: 'quotationId is required' });
    }

    // check that quotation exists
    const quotation = await prisma.quotation.findUnique({ where: { id: quotationId } });
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // enforce approved status (assuming 'APPROVED')
    if (quotation.status !== 'APPROVED') {
      return res.status(400).json({ message: 'Quotation must be approved before creating a sales order' });
    }

    const salesOrder = await prisma.salesOrder.create({
      data: {
        quotationId,
      },
    });

    res.status(201).json({ message: 'Sales order created', salesOrder });
  } catch (error) {
    console.error('createSalesOrder error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a BOM entry linking finished product to raw material
const addBOM = async (req, res) => {
  try {
    const { finishedProductId, materialId, quantityRequired } = req.body;
    if (!finishedProductId || !materialId || quantityRequired == null) {
      return res.status(400).json({ message: 'finishedProductId, materialId and quantityRequired are required' });
    }

    const bom = await prisma.bOM.create({
      data: {
        finishedProductId,
        materialId,
        quantityRequired: parseFloat(quantityRequired),
      },
    });

    res.status(201).json({ message: 'BOM entry created', bom });
  } catch (error) {
    console.error('addBOM error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get BOM by finished product id
const getBOMByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const bomList = await prisma.bOM.findMany({
      where: { finishedProductId: productId },
    });
    res.json({ bom: bomList });
  } catch (error) {
    console.error('getBOMByProduct error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all sales orders with client info
const getAllSalesOrders = async (_req, res) => {
  try {
    const salesOrders = await prisma.salesOrder.findMany({
      include: {
        quotation: {
          include: { lead: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ salesOrders });
  } catch (error) {
    console.error('getAllSalesOrders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createSalesOrder,
  addBOM,
  getBOMByProduct,
  getAllSalesOrders,
};
