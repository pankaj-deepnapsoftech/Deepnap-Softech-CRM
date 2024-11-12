const express = require('express');
const { createProformaInvoice, editProformaInvoice, deleteProformaInvoice, getAllProformaInvoices, getProformaInvoiceDetails, downloadProformaInvoice } = require('../../controllers/proforma invoice/controller');
const { validateHandler, editProformaInvoiceValidator, deleteProformaInvoiceValidator, createProformaInvoiceValidator, downloadProformaInvoiceValidator } = require('../../validators/proforma invoice/validator');
const router = express.Router();

router.post('/create-proforma-invoice', createProformaInvoiceValidator(), validateHandler, createProformaInvoice);
router.post('/edit-proforma-invoice', editProformaInvoiceValidator(), validateHandler, editProformaInvoice);
router.post('/delete-proforma-invoice', deleteProformaInvoiceValidator(), validateHandler, deleteProformaInvoice);
router.post('/all-proforma-invoices', getAllProformaInvoices);
router.post('/proforma-invoice-details', getProformaInvoiceDetails);
router.post('/download-proforma-invoice', downloadProformaInvoiceValidator(), validateHandler, downloadProformaInvoice);

module.exports = router;