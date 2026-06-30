const express = require('express');
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const authRoutes = express.Router();

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRoutes.get('/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleCallback
);
authRoutes.post('/register', authController.registerUsuario);
authRoutes.post('/login', authController.loginUsuario);
authRoutes.post('/logout', authController.logoutUsuario);

module.exports = authRoutes;
