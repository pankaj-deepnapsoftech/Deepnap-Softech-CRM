const express = require('express');
const { createPaymentValidator, validateHandler, editPaymentValidator, deletePaymentValidator, paymentDetailsValidator, downloadPaymentValidator } = require('../../validators/payment/validator');
const { editPayment, createPayment, deletePayment, getAllPayments, paymentDetails, downloadPayment } = require('../../controllers/payment/controller');
const router = express.Router();

router.post('/create-payment', createPaymentValidator(), validateHandler, createPayment);
router.post('/edit-payment', editPaymentValidator(), validateHandler, editPayment);
router.post('/delete-payment', deletePaymentValidator(), validateHandler, deletePayment);
router.post('/all-payments', getAllPayments);
router.post('/payment-details', paymentDetailsValidator(), validateHandler, paymentDetails);
router.post('/download-payment', downloadPaymentValidator(), validateHandler, downloadPayment);

module.exports = router;