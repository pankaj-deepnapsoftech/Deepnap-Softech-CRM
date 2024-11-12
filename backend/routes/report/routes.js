const express = require('express');
const { getPaymentReport, getExpenseReport } = require('../../controllers/report/controller');
const router = express.Router();

router.post('/get-payment-report', getPaymentReport);
router.post('/get-expense-report', getExpenseReport);

module.exports = router;
