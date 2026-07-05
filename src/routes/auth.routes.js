const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const authRoutes = express.Router();

// authRoutes.get(
//     '/google',
//     passport.authenticate('google', { scope: ['profile', 'email'] })
// );
// authRoutes.get(
//     '/google/callback',
//     passport.authenticate('google', { session: false }),
//     authController.googleCallback
// );
authRoutes.post('/register', authController.signUp);
authRoutes.post('/login', authController.signIn);
authRoutes.post('/logout', authMiddleware.verifyUserToken, authController.logout);

module.exports = authRoutes;
