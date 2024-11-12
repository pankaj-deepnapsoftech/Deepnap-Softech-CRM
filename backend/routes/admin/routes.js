const express = require('express');
const { getAllAdmins, getAdminDetails, getAllPermissions, editAdminAccess, deleteAdmin, assignToEmployee, changeSuperAdminDetails } = require('../../controllers/admin/controller');
const { adminDetails, validateHandler, deleteAdminValidator, editAdminAccessValidator, assignToEmployeeValidator, changeDetailsValidator } = require('../../validators/admin/validator');
const router = express.Router();

router.get('/all-admins', getAllAdmins);
router.post('/admin-details', adminDetails(), validateHandler, getAdminDetails);
router.get('/all-permissions', getAllPermissions);
router.post('/edit-admin-permissions', editAdminAccessValidator(), validateHandler, editAdminAccess);
router.post('/delete-admin', deleteAdminValidator(), validateHandler, deleteAdmin);
router.post('/assign-employee', assignToEmployeeValidator(), validateHandler, assignToEmployee);
router.post('/change-details', changeDetailsValidator(), validateHandler, changeSuperAdminDetails);

module.exports = router;