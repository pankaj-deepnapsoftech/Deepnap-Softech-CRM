const express = require('express');
const { createInvoice, editInvoice, deleteInvoice, getAllInvoices, getInvoiceDetails, downloadInvoice } = require('../../controllers/invoice/controller');
const { validateHandler, editInvoiceValidator, deleteInvoiceValidator, createInvoiceValidator, downloadInvoiceValidator } = require('../../validators/invoice/validator');
const router = express.Router();

router.post('/create-invoice', createInvoiceValidator(), validateHandler, createInvoice);
router.post('/edit-invoice', editInvoiceValidator(), validateHandler, editInvoice);
router.post('/delete-invoice', deleteInvoiceValidator(), validateHandler, deleteInvoice);
router.post('/all-invoices', getAllInvoices);
router.post('/invoice-details', getInvoiceDetails);
router.post('/download-invoice', downloadInvoiceValidator(), validateHandler, downloadInvoice);

module.exports = router;