const auditoriaController = require("../controllers/auditoria.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const express = require.apply('express');
const auditoriaRoutes = express.Router();

auditoriaRoutes.use(authMiddleware.verifyUserToken);
auditoriaRoutes.use(authMiddleware.authorizeByRole(['Gerente']));

auditoriaRoutes.get('/', auditoriaController.getAuditorias);

module.exports = auditoriaRoutes;