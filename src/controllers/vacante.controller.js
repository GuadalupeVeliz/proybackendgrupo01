const vacanteService = require('../services/vacante.service');
const auditoriaService = require("../services/auditoria.service");

const vacanteController = {};

vacanteController.createVacante = async (req, res) => {
  try {
    const vacante = await vacanteService.addVacante(req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Vacante',
          resultado: 'OK',
          entidadId: vacante.id,
        });
    return res.status(201).json({ success: true, data: vacante });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Vacante',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

vacanteController.getVacantes = async (req, res) => {
  try {
    const vacantes = await vacanteService.findVacantes();
    await auditoriaService.registrarCreate(req,{
          accion: 'Consulta', 
          modelo: 'Vacante',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: vacantes });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consulta', 
          modelo: 'Vacante',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

vacanteController.getVacante = async (req, res) => {
  try {
    const vacante = await vacanteService.findVacanteById(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consulta', 
          modelo: 'Vacante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consulta', 
          modelo: 'Vacante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

vacanteController.updateVacante = async (req, res) => {
  try {
    const vacante = await vacanteService.editVacante(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Vacante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Vacante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

vacanteController.deleteVacante = async (req, res) => {
  try {
    await vacanteService.deleteVacante(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Vacante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Vacante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = vacanteController;
