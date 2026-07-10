const express = require('express');
const paqueteTuristicoController = require('../controllers/paquete-turistico.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const cargarImagenesPaquete = require('../middlewares/paquete-imagen.middleware');

const paqueteTuristicoRoutes = express.Router();

paqueteTuristicoRoutes.get(
  '/',
  paqueteTuristicoController.getPaquetesTuristicos,
);
paqueteTuristicoRoutes.post(
  '/',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  cargarImagenesPaquete,
  paqueteTuristicoController.createPaqueteTuristico,
);
paqueteTuristicoRoutes.get(
  '/:id',
  paqueteTuristicoController.getPaqueteTuristicoById,
);
paqueteTuristicoRoutes.put(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  cargarImagenesPaquete,
  paqueteTuristicoController.updatePaqueteTuristico,
);
paqueteTuristicoRoutes.delete(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.deletePaqueteTuristico,
);

module.exports = paqueteTuristicoRoutes;
