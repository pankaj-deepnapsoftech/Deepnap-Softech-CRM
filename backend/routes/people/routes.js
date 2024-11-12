const express = require('express');
const { createPeople, editPeople, deletePeople, personDetails, allPersons } = require('../../controllers/people/controller');
const { createPeopleValidator, validateHandler, editPeopleValidator, deletePeopleValidator, peopleDetailsValidator } = require('../../validators/people/validator');
const router = express.Router();

router.post('/create-people', createPeopleValidator(), validateHandler, createPeople);
router.post('/edit-people', editPeopleValidator(), validateHandler, editPeople);
router.post('/delete-people', deletePeopleValidator(), validateHandler, deletePeople);
router.post('/person-details', peopleDetailsValidator(), validateHandler, personDetails);
router.post('/all-persons', allPersons);

module.exports = router;