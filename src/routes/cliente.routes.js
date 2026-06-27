const express = require('express');
const clienteRoutes = express.Router();
const clienteController = require('../controllers/cliente.controller');

clienteRoutes.get('/', clienteController.getClientes);
clienteRoutes.post('/', clienteController.createCliente);
clienteRoutes.get('/:id', clienteController.getCliente);
clienteRoutes.put('/:id', clienteController.updateCliente);
clienteRoutes.delete('/:id', clienteController.deleteCliente);

module.exports = clienteRoutes;
