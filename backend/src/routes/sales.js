const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createLead,
  getLeads,
  createQuotation,
  negotiateQuotation,
  getQuotationsByLead,
  importLeadsFromExcel,
} = require('../controllers/salesController');

const upload = multer({ storage: multer.memoryStorage() });

console.log('Sales routes loaded');

// Leads
router.post('/leads', createLead);
router.get('/getleads', getLeads);

// Quotations
router.post('/quotations', createQuotation);
router.put('/quotations/:id/negotiate', negotiateQuotation);
router.get('/leads/:leadId/quotations', getQuotationsByLead);

// Excel import
router.post('/import-excel', upload.single('file'), importLeadsFromExcel);

module.exports = router;