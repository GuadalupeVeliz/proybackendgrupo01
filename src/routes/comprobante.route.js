const express = require('express');
const comprobanteController = require('../controllers/comprobante.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const comprobanteRoutes = express.Router();

comprobanteRoutes.use(authMiddleware.verifyToken);

comprobanteRoutes.get(
  '/me',
  authMiddleware.authorize(['Cliente']),
  comprobanteController.getMyComprobantes
);
comprobanteRoutes.get(
  '/cliente/:clienteId',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.getComprobantesByCliente
);
comprobanteRoutes.get(
  '/:id/download-pdf',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  comprobanteController.downloadComprobantePDF
);
comprobanteRoutes.post(
  '/cancel',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.processCancelacion
);

comprobanteRoutes.get(
  '/',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.getComprobantes
);
comprobanteRoutes.post(
  '/',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.createComprobante
);
comprobanteRoutes.get(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.getComprobante
);
comprobanteRoutes.put(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.updateComprobante
);
comprobanteRoutes.delete(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista']),
  comprobanteController.deleteComprobante
);

module.exports = comprobanteRoutes;
