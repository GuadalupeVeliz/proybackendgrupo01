const empleadoService = require('../services/empleado.service');

const empleadoController = {};

empleadoController.createEmpleado = async (req, res) => {
  try {
    const empleado = await empleadoService.addEmpleado(req.body);
    return res.status(201).json({ success: true, data: empleado });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

empleadoController.getEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.findEmpleados();
    return res.status(200).json({ success: true, data: empleados });
  } catch (error) {
    return res.status(500).json({
      mensaje: error.message,
    });
  }
};

empleadoController.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await empleadoService.findEmpleadoById(req.params.id);
    return res.status(200).json({ success: true, data: empleado });
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

empleadoController.updateEmpleado = async (req, res) => {
  try {
    const empleado = await empleadoService.editEmpleado(req.params.id, req.body);
    return res.status(200).json({ success: true, data: empleado });
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

empleadoController.deleteEmpleado = async (req, res) => {
  try {
    await empleadoService.deleteEmpleado(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

module.exports = empleadoController;
