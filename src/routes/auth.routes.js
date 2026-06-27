const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/auth.controller');

authRoutes.post('/register', authController.registerUsuario);
authRoutes.post('/login', authController.loginUsuario);
authRoutes.post('/logout', authController.logoutUsuario);

module.exports = authRoutes;
