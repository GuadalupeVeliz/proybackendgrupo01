const express = require('express');
const paqueteTuristicoController = require('../controllers/paquete-turistico.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const paqueteTuristicoRoutes = express.Router();

paqueteTuristicoRoutes.use(authMiddleware.verifyToken);

paqueteTuristicoRoutes.get(
  '/',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  paqueteTuristicoController.getPaquetesTuristicos
);
paqueteTuristicoRoutes.post(
  '/',
  authMiddleware.authorize(['Gerente']),
  paqueteTuristicoController.createPaqueteTuristico
);
paqueteTuristicoRoutes.get(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  paqueteTuristicoController.getPaqueteTuristico
);
paqueteTuristicoRoutes.put(
  '/:id',
  authMiddleware.authorize(['Gerente']),
  paqueteTuristicoController.updatePaqueteTuristico
);
paqueteTuristicoRoutes.delete(
  '/:id',
  authMiddleware.authorize(['Gerente']),
  paqueteTuristicoController.deletePaqueteTuristico
);

module.exports = paqueteTuristicoRoutes;
