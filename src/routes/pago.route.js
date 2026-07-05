const express = require('express');
const pagoController = require('../controllers/pago.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const pagoRoutes = express.Router();

pagoRoutes.post(
  '/checkout-session',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  pagoController.checkoutSession
);
pagoRoutes.post('/webhook', pagoController.webhook);
pagoRoutes.get(
  '/',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  pagoController.getPagos
);
pagoRoutes.post(
  '/',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  pagoController.createPago
);
pagoRoutes.get(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  pagoController.getPago
);
pagoRoutes.put(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  pagoController.updatePago
);
pagoRoutes.delete(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  pagoController.deletePago
);

module.exports = pagoRoutes;
