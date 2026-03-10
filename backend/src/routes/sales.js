const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  createQuotation,
  negotiateQuotation,
  getQuotationsByLead,
} = require('../controllers/salesController');

console.log('Sales routes loaded');

// Leads
router.post('/leads', createLead);
router.get('/getleads', getLeads);

// Quotations
router.post('/quotations', createQuotation);
router.put('/quotations/:id/negotiate', negotiateQuotation);
router.get('/leads/:leadId/quotations', getQuotationsByLead);

module.exports = router;