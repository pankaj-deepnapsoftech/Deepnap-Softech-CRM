const express = require('express');
const { register, login, loginWithAccessToken, isAuthenticated, passwordResetToken, getOTP, verifyOTP, resetPassword, verifyOTPAfterRegister } = require('../../controllers/auth/controller');
const { registerValidator, validateHandler, loginValidator, passwordResetTokenValidator, getOTPValidator, resetPasswordValidator, registerVerifyValidator } = require('../../validators/auth/validator');
const router = express.Router();

router.post('/register', registerValidator(), validateHandler, register);
router.post('/register-verify', registerVerifyValidator(), validateHandler, verifyOTPAfterRegister);
router.post('/login', loginValidator(), validateHandler, login);
router.post('/login-with-access-token', loginWithAccessToken);
router.post('/get-otp', getOTPValidator(), validateHandler, getOTP);
router.post('/password-reset-token', passwordResetTokenValidator(), validateHandler, verifyOTP);
router.post('/reset-password', resetPasswordValidator(), validateHandler, resetPassword);

module.exports = router;