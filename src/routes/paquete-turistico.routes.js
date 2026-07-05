const express = require('express');
const paqueteTuristicoController = require('../controllers/paquete-turistico.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const paqueteTuristicoRoutes = express.Router();

paqueteTuristicoRoutes.use(authMiddleware.verifyUserToken);

paqueteTuristicoRoutes.get(
  '/',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  paqueteTuristicoController.getPaquetesTuristicos,
);
paqueteTuristicoRoutes.post(
  '/',
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.createPaqueteTuristico,
);
paqueteTuristicoRoutes.get(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  paqueteTuristicoController.getPaqueteTuristicoById,
);
paqueteTuristicoRoutes.put(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.updatePaqueteTuristico,
);
paqueteTuristicoRoutes.delete(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.deletePaqueteTuristico,
);

module.exports = paqueteTuristicoRoutes;
