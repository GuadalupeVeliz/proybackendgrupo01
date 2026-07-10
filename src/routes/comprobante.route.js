const express = require('express');
const comprobanteController = require('../controllers/comprobante.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const comprobanteRoutes = express.Router();

comprobanteRoutes.use(authMiddleware.verifyUserToken);

comprobanteRoutes.get(
  '/me',
  authMiddleware.authorizeByRole(['Cliente']),
  comprobanteController.getMyComprobantes,
);
comprobanteRoutes.get(
  '/cliente/:clienteId',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  comprobanteController.getComprobantesByClienteId,
);
comprobanteRoutes.get(
  '/:id/download-pdf',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  comprobanteController.downloadComprobantePDF,
);

comprobanteRoutes.get(
  '/',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  comprobanteController.getComprobantes,
);
comprobanteRoutes.post(
  '/',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  comprobanteController.createComprobante,
);
comprobanteRoutes.get(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  comprobanteController.getComprobanteById,
);
comprobanteRoutes.put(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  comprobanteController.updateComprobante,
);
comprobanteRoutes.delete(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  comprobanteController.deleteComprobante,
);

module.exports = comprobanteRoutes;
