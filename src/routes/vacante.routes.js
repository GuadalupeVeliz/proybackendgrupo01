const express = require('express');
const vacanteController = require('../controllers/vacante.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const vacanteRoutes = express.Router();

vacanteRoutes.get(
  '/',
  vacanteController.getVacantes,
);
vacanteRoutes.post(
  '/',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.createVacante,
);
vacanteRoutes.get(
  '/:id',
  vacanteController.getVacante,
);
vacanteRoutes.put(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.updateVacante,
);
vacanteRoutes.delete(
  '/:id',
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.deleteVacante,
);

module.exports = vacanteRoutes;
