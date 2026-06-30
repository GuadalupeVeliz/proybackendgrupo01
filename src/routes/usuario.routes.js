const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const usuarioRoutes = express.Router();

usuarioRoutes.get('/', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']) , usuarioController.getUsuarios);
usuarioRoutes.post('/', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']) , usuarioController.createUsuario);
usuarioRoutes.get('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']) , usuarioController.getUsuario);
usuarioRoutes.put('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']) , usuarioController.updateUsuario);
usuarioRoutes.delete('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']) , usuarioController.deleteUsuario);

module.exports = usuarioRoutes;
