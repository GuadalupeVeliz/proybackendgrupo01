const express = require('express');
const reservaController = require('../controllers/reserva.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const reservaRoutes = express.Router();

reservaRoutes.use(authMiddleware.verifyUserToken);

reservaRoutes.get(
  '/',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservas,
);

reservaRoutes.post(
  '/',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.createReserva,
);

reservaRoutes.get(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservaById,
);

reservaRoutes.put(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  reservaController.updateReserva,
);

reservaRoutes.delete(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  reservaController.deleteReserva,
);

reservaRoutes.get(
  '/cliente/:clienteId',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservasByClienteId,
);

reservaRoutes.put(
  '/checkout/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.checkoutReserva,
);

reservaRoutes.put(
  '/cancel/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.cancelReserva,
);

module.exports = reservaRoutes;
