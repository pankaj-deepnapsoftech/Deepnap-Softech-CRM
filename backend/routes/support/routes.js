const { isAuthenticated } = require('../../controllers/auth/controller');
const { createSupport, deleteSupport, editSupport, getAllSupport, getSupportDetails, getAllAssignedSupport } = require('../../controllers/support/controller');

const express = require('express');
const { checkAccess } = require('../../helpers/checkAccess');
const router = express.Router();

router.post('/create-support', createSupport);
router.post('/delete-support', isAuthenticated, checkAccess, deleteSupport);
router.post('/edit-support', isAuthenticated, checkAccess, editSupport);
router.post('/get-support', getSupportDetails);
router.get('/get-all-support', getAllSupport);
router.get('/get-all-assigned-support', isAuthenticated, checkAccess, getAllAssignedSupport);

module.exports = router;