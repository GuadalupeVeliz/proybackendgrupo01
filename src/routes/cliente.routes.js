const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const clienteRoutes = express.Router();

clienteRoutes.use(authMiddleware.verifyUserToken);
clienteRoutes.use(authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']));

clienteRoutes.get('/', clienteController.getClientes);
clienteRoutes.post('/', clienteController.createCliente);
clienteRoutes.get('/:id', clienteController.getCliente);
clienteRoutes.put('/:id', clienteController.updateCliente);
clienteRoutes.delete('/:id', clienteController.deleteCliente);

module.exports = clienteRoutes;
