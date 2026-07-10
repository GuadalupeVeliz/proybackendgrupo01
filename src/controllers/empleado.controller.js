const auditoriaService = require('../services/auditoria.service');
const empleadoService = require('../services/empleado.service');

const empleadoController = {};

empleadoController.createEmpleado = async (req, res) => {
  try {
    const empleado = await empleadoService.addEmpleado(req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Empleado',
          resultado: 'OK',
          entidadId: empleado.id,
        });
    return res.status(201).json({ success: true, data: empleado });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Empleado',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

empleadoController.getEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.findEmpleados();
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Empleado',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: empleados });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Empleado',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({
      mensaje: error.message,
    });
  }
};

empleadoController.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await empleadoService.findEmpleadoById(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Empleado',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: empleado });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Empleado',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

empleadoController.updateEmpleado = async (req, res) => {
  try {
    const empleado = await empleadoService.editEmpleado(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Empleado',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: empleado });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Empleado',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

empleadoController.deleteEmpleado = async (req, res) => {
  try {
    await empleadoService.deleteEmpleado(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Empleado',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Empleado',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

module.exports = empleadoController;
