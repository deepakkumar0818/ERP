const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const prisma = new PrismaClient();

// Create a new lead
const createLead = async (req, res) => {
  try {
    const { clientName, requirement } = req.body;
    if (!clientName || !requirement) {
      return res.status(400).json({ message: 'clientName and requirement are required' });
    }

    const lead = await prisma.lead.create({
      data: {
        clientName,
        requirement,
      },
    });

    res.status(201).json({ message: 'Lead created', lead });
  } catch (error) {
    console.error('createLead error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all leads
const getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { quotations: true },
    });
    res.json({ leads });
  } catch (error) {
    console.error('getLeads error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a quotation for a given lead
const createQuotation = async (req, res) => {
  try {
    const { leadId, basePrice } = req.body;
    if (!leadId || basePrice == null) {
      return res.status(400).json({ message: 'leadId and basePrice are required' });
    }

    // Optionally verify the lead exists
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const quotation = await prisma.quotation.create({
      data: {
        leadId,
        basePrice: parseFloat(basePrice),
      },
    });

    res.status(201).json({ message: 'Quotation created', quotation });
  } catch (error) {
    console.error('createQuotation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a quotation's negotiated price and status
const negotiateQuotation = async (req, res) => {
  try {
    const { id } = req.params; // quotation id
    const { negotiatedPrice, status } = req.body;

    const data = {};
    if (negotiatedPrice != null) data.negotiatedPrice = parseFloat(negotiatedPrice);
    if (status) data.status = status;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data,
    });

    res.json({ message: 'Quotation updated', quotation });
  } catch (error) {
    console.error('negotiateQuotation error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all quotations for a specific lead
const getQuotationsByLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const quotations = await prisma.quotation.findMany({
      where: { leadId },
    });
    res.json({ quotations });
  } catch (error) {
    console.error('getQuotationsByLead error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Import leads (and optional quotations) from an Excel file
// Expected columns (header row):
// - Client Name
// - Requirement
// - Base Price  (optional – creates an initial quotation when present)
const importLeadsFromExcel = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    const operations = [];

    for (const row of rows) {
      const clientName = row['Client Name'] || row['clientName'] || row['Client'];
      const requirement = row['Requirement'] || row['requirement'] || row['Requirements'];
      const basePriceRaw = row['Base Price'] || row['basePrice'] || row['Price'];

      if (!clientName || !requirement) {
        // Skip rows that don't have minimum required fields
        continue;
      }

      const op = prisma.lead.create({
        data: {
          clientName,
          requirement,
          quotations: basePriceRaw
            ? {
                create: {
                  basePrice: parseFloat(basePriceRaw),
                },
              }
            : undefined,
        },
        include: { quotations: true },
      });

      operations.push(op);
    }

    if (!operations.length) {
      return res
        .status(400)
        .json({ message: 'No valid rows found in Excel file' });
    }

    const createdLeads = await prisma.$transaction(operations);

    res.status(201).json({
      message: 'Leads imported successfully from Excel',
      count: createdLeads.length,
      leads: createdLeads,
    });
  } catch (error) {
    console.error('importLeadsFromExcel error:', error);
    res.status(500).json({ message: 'Failed to import leads from Excel' });
  }
};

module.exports = {
  createLead,
  getLeads,
  createQuotation,
  negotiateQuotation,
  getQuotationsByLead,
  importLeadsFromExcel,
};