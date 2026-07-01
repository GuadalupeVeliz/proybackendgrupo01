const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const perfilController = require('../controllers/perfil.controller');

const perfilRoutes = express.Router();

perfilRoutes.get('/', authMiddleware.verifyToken, perfilController.getPerfil);
perfilRoutes.put(
    '/',
    authMiddleware.verifyToken,
    perfilController.updatePerfil
);

module.exports = perfilRoutes;
