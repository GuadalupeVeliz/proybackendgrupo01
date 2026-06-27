const express = require('express');
const usuarioRoutes = express.Router();
const usuarioController = require('../controllers/usuario.controller');

usuarioRoutes.get('/', usuarioController.getUsuarios);
usuarioRoutes.post('/', usuarioController.createUsuario);
usuarioRoutes.get('/:id', usuarioController.getUsuario);
usuarioRoutes.put('/:id', usuarioController.updateUsuario);
usuarioRoutes.delete('/:id', usuarioController.deleteUsuario);

module.exports = usuarioRoutes;
