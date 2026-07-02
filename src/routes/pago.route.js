const express = require('express');
const pagoController = require('../controllers/pago.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const pagoRoutes = express.Router();

pagoRoutes.post(
  '/checkout-session',
  authMiddleware.verifyToken,
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  pagoController.checkoutSession
);
pagoRoutes.post('/webhook', pagoController.webhook);
pagoRoutes.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  pagoController.getPagos
);
pagoRoutes.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  pagoController.createPago
);
pagoRoutes.get(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  pagoController.getPago
);
pagoRoutes.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  pagoController.updatePago
);
pagoRoutes.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  pagoController.deletePago
);

module.exports = pagoRoutes;
