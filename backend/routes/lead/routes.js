const express = require('express');
const { createLead, editLead, deleteLead, leadDetails, allLeads, assignedLeads, followupReminders, seenFollowupReminders, getUnseenNotfications } = require('../../controllers/Lead/controller');
const { createLeadValidator, validateHandler, editLeadValidator, deleteLeadValidator, leadDetailsValidator } = require('../../validators/lead/validator');
const router = express.Router();

router.post('/create-lead', createLeadValidator(), validateHandler, createLead);
router.post('/edit-lead', editLeadValidator(), validateHandler, editLead);
router.post('/delete-lead', deleteLeadValidator(), validateHandler, deleteLead);
router.post('/lead-details', leadDetailsValidator(), validateHandler, leadDetails);
router.post('/all-leads', allLeads);
router.get('/assigned-lead', assignedLeads);
router.get('/followup-reminders', followupReminders);
router.post('/seen-followup-reminders', seenFollowupReminders);
router.get('/get-unseen-followup-reminders', getUnseenNotfications);

module.exports = router;