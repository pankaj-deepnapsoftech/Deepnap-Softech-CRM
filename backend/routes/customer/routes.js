const express = require('express');
const { createCustomer, editCustomer, deleteCustomer, allCustomers, customerDetails } = require('../../controllers/customer/controller');
const { createCustomerValidator, validateHandler, deleteCustomerValidator, editCustomerValidator, customerDetailsValidator } = require('../../validators/customer/validator');
const router = express.Router();

router.post('/create-customer', createCustomerValidator(), validateHandler, createCustomer);
router.post('/edit-customer', editCustomerValidator(), validateHandler, editCustomer);
router.post('/delete-customer', deleteCustomerValidator(), validateHandler, deleteCustomer);
router.post('/customer-details', customerDetailsValidator(), validateHandler, customerDetails);
router.post('/all-customers', allCustomers);

module.exports = router;