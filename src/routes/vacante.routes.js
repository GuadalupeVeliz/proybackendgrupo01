const express = require('express');
const vacanteController = require('../controllers/vacante.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const vacanteRoutes = express.Router();

vacanteRoutes.use(authMiddleware.verifyUserToken);

vacanteRoutes.get(
  '/',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  vacanteController.getVacantes
);
vacanteRoutes.post(
  '/',
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.createVacante
);
vacanteRoutes.get(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  vacanteController.getVacante
);
vacanteRoutes.put(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.updateVacante
);
vacanteRoutes.delete(
  '/:id',
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.deleteVacante
);

module.exports = vacanteRoutes;
