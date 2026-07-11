const auditoriaController = require("../controllers/auditoria.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const express = require('express');
const auditoriaRoutes = express.Router();

auditoriaRoutes.use(authMiddleware.verifyUserToken);
auditoriaRoutes.use(authMiddleware.authorizeByRole(['Gerente']));

auditoriaRoutes.get('/', auditoriaController.getAuditorias);
auditoriaRoutes.get('/filtros',auditoriaController.getFiltros);

module.exports = auditoriaRoutes;