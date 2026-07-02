const express = require('express');
const reservaController = require('../controllers/reserva.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const reservaRoutes = express.Router();

reservaRoutes.use(authMiddleware.verifyToken);

reservaRoutes.get(
  '/',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservas
);

reservaRoutes.post(
  '/',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.createReserva
);

reservaRoutes.get(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReserva
);

reservaRoutes.get(
  '/cliente/:clienteId',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  reservaController.getReservasByCliente
);

reservaRoutes.put(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  reservaController.updateReserva
);

reservaRoutes.put(
  '/checkout/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.checkoutReserva
);

reservaRoutes.put(
  '/cancel/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.cancelReserva
);

reservaRoutes.delete(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  reservaController.deleteReserva
);

module.exports = reservaRoutes;
