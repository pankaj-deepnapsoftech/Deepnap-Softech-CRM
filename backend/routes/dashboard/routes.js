const express = require('express');
const { isAuthenticated } = require('../../controllers/auth/controller');
const { invoiceSummary, offerSummary, proformaInvoiceSummary, customerSummary, amountSummary, productSummary, totalFollowUps, leadsSummary } = require('../../controllers/dashboard/controller');
const router = express.Router();

router.post('/invoice-summary', isAuthenticated, invoiceSummary);
router.post('/offer-summary', isAuthenticated, offerSummary);
router.post('/proforma-invoice-summary', isAuthenticated, proformaInvoiceSummary);
router.post('/customer-summary', isAuthenticated, customerSummary);
router.post('/amount-summary', isAuthenticated, amountSummary);
router.post('/product-summary', isAuthenticated, productSummary);
router.post('/leads-summary', isAuthenticated, leadsSummary);

module.exports = router;