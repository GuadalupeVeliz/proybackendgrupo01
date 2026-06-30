const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const clienteRoutes = express.Router();

clienteRoutes.get('/', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), clienteController.getClientes);
clienteRoutes.post('/', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), clienteController.createCliente);
clienteRoutes.get('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), clienteController.getCliente);
clienteRoutes.put('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), clienteController.updateCliente);
clienteRoutes.delete('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), clienteController.deleteCliente);

module.exports = clienteRoutes;
