const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const perfilController = require('../controllers/perfil.controller');

const perfilRoutes = express.Router();

perfilRoutes.use(authMiddleware.verifyUserToken);
perfilRoutes.use(authMiddleware.authorizeByRole(['Gerente', 'Cliente']));

perfilRoutes.get('/', perfilController.getPerfil);
perfilRoutes.put('/', perfilController.updatePerfil);

module.exports = perfilRoutes;
