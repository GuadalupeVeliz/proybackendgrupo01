const auditoriaService = require("../services/auditoria.service");
const dashboardService = require("../services/dashboard.service");

const dashboardController = {};

dashboardController.getResumen = async (req, res) => {
  try {
    const resumen = await dashboardService.getResumen();
    await auditoriaService.registrarCreate(req, {
      accion: 'Consulta',
      modelo: 'Dashboard',
      resultado: 'OK',
    });
    res.status(200).json(resumen);
  } catch (error) {
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'Error',
      detalleError: error.message
    });
    console.error("Error en getResumen:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener el resumen del dashboard" });
  }
};

dashboardController.getReservasPorMes = async (req, res) => {
  try {
    const { anio = new Date().getFullYear() } = req.query;
    const reservasPorMes = await dashboardService.getReservasPorMes(anio);
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'OK',
    });
    res.status(200).json(reservasPorMes);
  } catch (error) {
    console.error("Error en getReservasPorMes:", error);
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'Error',
      detalleError: error.message
    });
    res.status(500).json({ mensaje: "Error al obtener reservas por mes." });
  }
};

dashboardController.getReservasPorEstado = async (req, res) => {
  try {
    const reservasPorEstado = await dashboardService.getReservasPorEstado();
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'OK',
    });
    res.status(200).json(reservasPorEstado);
  } catch (error) {
    console.error("Error en getReservasPorEstado:", error);
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'Error',
      detalleError: error.message
    });
    res.status(500).json({ mensaje: "Error al obtener reservas por estado" });
  }
};

dashboardController.getIngresosEvolucion = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const evolucionIngresos = await dashboardService.getIngresosEvolucion(
      desde,
      hasta,
    );
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'OK',
    });
    res.status(200).json(evolucionIngresos);
  } catch (error) {
    console.error("Error en getIngresosEvolucion:", error);
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'Error',
      detalleError: error.message
    });
    res
      .status(500)
      .json({ mensaje: "Error al obtener los ingresos en evolucion" });
  }
};

dashboardController.getReservas = async (req, res) => {
  try {
    const { estado, search, page = 1, limit = 10 } = req.query;
    const reservas = await dashboardService.getReservas({
      estado,
      search,
      page,
      limit,
    });
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'OK',
    });
    res.status(200).json(reservas);
  } catch (error) {
    console.error("Error en getReservas:", error);
    await auditoriaService.registrarCreate(req, {
      accion: 'Consultar',
      modelo: 'Dashboard',
      resultado: 'Error',
      detalleError: error.message
    });
    res.status(500).json({ mensaje: "Error al obtener las Reservas" });
  }
};

dashboardController.exportarPDF = async (req, res) => {
  try {
    const anio = req.query.anio ? parseInt(req.query.anio, 10) : new Date().getFullYear();
    const pdfBuffer = await dashboardService.generarPDF(anio);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte-dashboard-${anio}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    await auditoriaService.registrarCreate(req, {
      accion: 'Exportar',
      modelo: 'Dashboard',
      resultado: 'OK',
    });
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    await auditoriaService.registrarCreate(req,{
          accion: 'Exportar', 
          modelo: 'Dashboard',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ mensaje: 'Error al generar el PDF', error: error.message });
  }
};

dashboardController.exportarExcel = async (req, res) => {
  try {
    const anio = req.query.anio ? parseInt(req.query.anio, 10) : new Date().getFullYear();
    const excelBuffer = await dashboardService.generarExcel(anio);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=reporte-dashboard-${anio}.xlsx`,
      'Content-Length': excelBuffer.length,
    });
    await auditoriaService.registrarCreate(req,{
          accion: 'Exportar', 
          modelo: 'Dashboard',
          resultado: 'OK',
        });
    return res.send(excelBuffer);
  } catch (error) {
    console.error('Error generando Excel:', error);
    await auditoriaService.registrarCreate(req,{
          accion: 'Exportar', 
          modelo: 'Dashboard',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ mensaje: 'Error al generar el Excel', error: error.message });
  }
};

module.exports = dashboardController;
