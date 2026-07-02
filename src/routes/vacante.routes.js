const express = require('express');
const vacanteController = require('../controllers/vacante.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const vacanteRoutes = express.Router();

vacanteRoutes.use(authMiddleware.verifyToken);

vacanteRoutes.get(
  '/',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  vacanteController.getVacantes
);
vacanteRoutes.post(
  '/',
  authMiddleware.authorize(['Gerente']),
  vacanteController.createVacante
);
vacanteRoutes.get(
  '/:id',
  authMiddleware.authorize(['Gerente', 'Recepcionista', 'Cliente']),
  vacanteController.getVacante
);
vacanteRoutes.put(
  '/:id',
  authMiddleware.authorize(['Gerente']),
  vacanteController.updateVacante
);
vacanteRoutes.delete(
  '/:id',
  authMiddleware.authorize(['Gerente']),
  vacanteController.deleteVacante
);

module.exports = vacanteRoutes;
