const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const usuarioRoutes = express.Router();

usuarioRoutes.use(authMiddleware.verifyToken);
usuarioRoutes.use(authMiddleware.authorize(['Gerente']));

usuarioRoutes.get('/', usuarioController.getUsuarios);
usuarioRoutes.post('/', usuarioController.createUsuario);
usuarioRoutes.get('/:id', usuarioController.getUsuario);
usuarioRoutes.put('/:id', usuarioController.updateUsuario);
usuarioRoutes.delete('/:id', usuarioController.deleteUsuario);

module.exports = usuarioRoutes;
