const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const authRoutes = express.Router();

authRoutes.post('/signup', authController.signUp);
authRoutes.post('/login', authController.login);
authRoutes.post('/logout', authMiddleware.verifyUserToken, authController.logout);

module.exports = authRoutes;
