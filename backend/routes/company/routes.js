const express = require('express');
const { createCompanyValidator, validateHandler, editCompanyValidator, deleteCompanyValidator, companyDetailsValidator } = require('../../validators/company/validator');
const { createCompany, editCompany, deleteCompany, companyDetails, allCompanies } = require('../../controllers/company/controller');
const router = express.Router();

router.post('/create-company', createCompanyValidator(), validateHandler, createCompany);
router.post('/edit-company', editCompanyValidator(), validateHandler, editCompany);
router.post('/delete-company', deleteCompanyValidator(), validateHandler, deleteCompany);
router.post('/company-details', companyDetailsValidator(), validateHandler, companyDetails);
router.post('/all-companies', allCompanies);

module.exports = router;