const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const dashboardRoutes = express.Router();

dashboardRoutes.use(authMiddleware.verifyUserToken);

dashboardRoutes.get(
  "/resumen",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Resumen general del dashboard'
    #swagger.description = 'Devuelve totales de reservas, ingresos y paquete turistico mas vendido'
    #swagger.consumes = ['application/json']
    #swagger.responses[200] = {
      description: 'Resumen obtenido correctamente',
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener el resumen del dashboard'
    }
  */
  dashboardController.getResumen,
);

dashboardRoutes.get(
  "/reservas-por-mes",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Reservas agrupadas por mes'
    #swagger.description = 'Devuelve la cantidad de reservas agrupadas por mes para un año dado'
    #swagger.parameters['anio'] = {
      in: 'query',
      description: 'Año a consultar (por defecto el año actual)',
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Reservas por mes obtenidas correctamente',
      schema: { mes: "01", cantidad: 5 }
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener reservas por mes',
      schema: { mensaje: "Error al obtener reservas por mes." }
    }
  */
  dashboardController.getReservasPorMes,
);

dashboardRoutes.get(
  "/reservas-por-estado",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Reservas agrupadas por estado'
    #swagger.description = 'Devuelve la cantidad de reservas agrupadas por estado'
    #swagger.responses[200] = {
      description: 'Reservas por estado obtenidas correctamente',
      schema: [{ estado: "pendiente", cantidad: 10 }]
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener reservas por estado',
      schema: { mensaje: "Error al obtener reservas por estado" }
    }
  */
  dashboardController.getReservasPorEstado,
);

dashboardRoutes.get(
  "/ingresos-evolucion",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Evolución de ingresos'
    #swagger.description = 'Devuelve la evolución mensual de ingresos entre dos fechas'
    #swagger.parameters['desde'] = {
      in: 'query',
      description: 'Fecha de inicio (YYYY-MM-DD)',
      type: 'string'
    }
    #swagger.parameters['hasta'] = {
      in: 'query',
      description: 'Fecha de fin (YYYY-MM-DD)',
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Evolución de ingresos obtenida correctamente',
      schema: [{ mes: "2025-01", total: 15000 }]
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener los ingresos en evolucion',
      schema: [{ mensaje: "Error al obtener los ingresos en evolucion" }]
    }
  */
  dashboardController.getIngresosEvolucion,
);

dashboardRoutes.get(
  "/reservas",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Listado de reservas'
    #swagger.description = 'Devuelve un listado paginado de reservas, con filtros opcionales por estado y búsqueda por cliente'
    #swagger.parameters['estado'] = {
      in: 'query',
      description: 'Filtrar por estado de la reserva',
      type: 'string'
    }
    #swagger.parameters['search'] = {
      in: 'query',
      description: 'Buscar por nombre completo o DNI del cliente',
      type: 'string'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Número de página (por defecto 1)',
      type: 'integer'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: 'Cantidad de resultados por página (por defecto 10)',
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Reservas obtenidas correctamente',
      schema: {
        total: 42,
        pagina: 1,
        totalPaginas: 5,
        reservas: []
      }
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener las Reservas',
      schema: { mensaje: "Error al obtener las Reservas" }
    }
  */
  dashboardController.getReservas,
);

dashboardRoutes.get(
  "/exportar/pdf",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Exportar reporte del dashboard en PDF'
    #swagger.description = 'Genera un PDF con el resumen de reservas, ingresos y gráficos (barras, torta y línea) para el año indicado'
    #swagger.parameters['anio'] = {
      in: 'query',
      description: 'Año a consultar (por defecto, el año actual)',
      required: false,
      type: 'integer',
      example: 2026
    }
    #swagger.produces = ['application/pdf']
    #swagger.responses[200] = {
      description: 'PDF generado correctamente',
      content: {
        'application/pdf': {
          schema: { type: 'string', format: 'binary' }
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Error al generar el PDF'
    }
  */
  dashboardController.exportarPDF,
);

dashboardRoutes.get(
  "/exportar/excel",
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Exportar reporte del dashboard en Excel'
    #swagger.description = 'Genera un archivo Excel con el resumen de reservas, ingresos por mes, reservas por estado y evolución de ingresos, incluyendo gráficos embebidos, para el año indicado'
    #swagger.parameters['anio'] = {
      in: 'query',
      description: 'Año a consultar (por defecto, el año actual)',
      required: false,
      type: 'integer',
      example: 2026
    }
    #swagger.produces = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    #swagger.responses[200] = {
      description: 'Excel generado correctamente',
      content: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          schema: { type: 'string', format: 'binary' }
        }
      }
    }
    #swagger.responses[500] = {
      description: 'Error al generar el Excel'
    }
  */
  dashboardController.exportarExcel,
);

module.exports = dashboardRoutes;
