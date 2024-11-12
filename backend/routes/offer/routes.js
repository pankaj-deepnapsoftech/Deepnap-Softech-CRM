const express = require('express');
const { createOffer, getAllOffers, deleteOffer, editOffer, getOfferDetails, downloadOffer } = require('../../controllers/offer/controller');
const { createOfferValidator, validateHandler, editOfferValidator, deleteOfferValidator, offerDetailsValidator, downloadOfferValidator } = require('../../validators/offer/validator');
const router = express.Router();

router.post('/create-offer', createOfferValidator(), validateHandler, createOffer);
router.post('/all-offers', getAllOffers);
router.post('/delete-offer', deleteOfferValidator(), validateHandler, deleteOffer);
router.post('/edit-offer', editOfferValidator(), validateHandler, editOffer);
router.post('/offer-details', offerDetailsValidator(), validateHandler, getOfferDetails);
router.post('/download-offer', downloadOfferValidator(), validateHandler, downloadOffer);

module.exports = router;
