const paqueteTuristicoService = require('../services/paquete-turistico.service');
const auditoriaService = require("../services/auditoria.service");

const paqueteTuristicoController = {};

paqueteTuristicoController.createPaqueteTuristico = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.addPaqueteTuristico(req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: paqueteTuristico.id,
        });
    return res.status(201).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.getPaquetesTuristicos = async (req, res) => {
  try {
    const paquetesTuristicos = await paqueteTuristicoService.findPaquetesTuristicos(req.query.lang);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: paquetesTuristicos });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.getPaqueteTuristicoById = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.findPaqueteTuristicoById(req.params.id,req.query.lang);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.updatePaqueteTuristico = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.editPaqueteTuristico(
      req.params.id,
      req.body
    );
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.deletePaqueteTuristico = async (req, res) => {
  try {
    await paqueteTuristicoService.deletePaqueteTuristico(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = paqueteTuristicoController;
