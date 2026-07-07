const express = require('express');

const authService = require('../services/auth.service');
const googleAuthService = require('../services/google.auth.service');
const googleAuthController = require('../controllers/google-auth.controller');

const googleAuthRoutes = express.Router();

googleAuthRoutes.post('/signup', googleAuthController.signup);

googleAuthRoutes.post('/signin', googleAuthController.signin);

module.exports = googleAuthRoutes;