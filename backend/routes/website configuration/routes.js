const express = require('express');
const { getFacebookApi, getIndiamartApi, updateFacebookApi, updateIndiamartApi } = require('../../controllers/website configuration/controller');
const router = express.Router();

router.get('/facebook-api', getFacebookApi);
router.get('/indiamart-api', getIndiamartApi);
router.post('/facebook-api', updateFacebookApi);
router.post('/indiamart-api', updateIndiamartApi);

module.exports = router;