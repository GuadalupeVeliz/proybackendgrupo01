const express = require('express');
const authController = require('../controllers/auth.controller');

const authRoutes = express.Router();

authRoutes.post('/register', authController.registerUsuario);
authRoutes.post('/login', authController.loginUsuario);
authRoutes.post('/logout', authController.logoutUsuario);

module.exports = authRoutes;
