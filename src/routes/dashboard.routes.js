const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require('../middlewares/auth.middleware');

const dashboardRoutes = express.Router();

dashboardRoutes.use(authMiddleware.verifyUserToken);

dashboardRoutes.get("/resumen", dashboardController.getResumen);
dashboardRoutes.get("/reservas-por-mes", dashboardController.getReservasPorMes);
dashboardRoutes.get("/reservas-por-estado", dashboardController.getReservasPorEstado);
dashboardRoutes.get("/ingresos-evolucion", dashboardController.getIngresosEvolucion);
dashboardRoutes.get("/reservas", dashboardController.getReservas);
dashboardRoutes.get('/exportar/pdf', dashboardController.exportarPDF);
dashboardRoutes.get('/exportar/excel', dashboardController.exportarExcel);

module.exports = dashboardRoutes;
