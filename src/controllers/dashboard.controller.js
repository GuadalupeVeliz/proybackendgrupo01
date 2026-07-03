const dashboardService = require("../services/dashboard.service");

const dashboardController = {};

dashboardController.getResumen = async (req, res) => {
  try {
    const resumen = await dashboardService.getResumen();
    res.status(200).json(resumen);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el resumen del dashboard" });
  }
};

dashboardController.getReservasPorMes = async (req, res) => {
  try {
    const { anio = new Date().getFullYear() } = req.query;
    const reservasPorMes = await dashboardService.getReservasPorMes(anio);
    res.status(200).json(reservasPorMes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reservas por mes." });
  }
};

dashboardController.getReservasPorEstado = async (req, res) => {
  try {
    const reservasPorEstado = await dashboardService.getReservasPorEstado();
    res.status(200).json(reservasPorEstado);
  } catch (error) {
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
    res.status(200).json(evolucionIngresos);
  } catch (error) {
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
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las Reservas" });
  }
};

module.exports = dashboardController;
