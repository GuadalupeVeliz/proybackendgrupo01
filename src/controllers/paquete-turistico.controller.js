const paqueteTuristicoService = require('../services/paquete-turistico.service');

const paqueteTuristicoController = {};

paqueteTuristicoController.createPaqueteTuristico = async (req, res) => {
  try {
    const paquete = await paqueteTuristicoService.addPaqueteTuristico(req.body);
    return res.status(201).json(paquete);
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

paqueteTuristicoController.getPaquetesTuristicos = async (req, res) => {
  try {
    const paquetes = await paqueteTuristicoService.findPaquetesTuristicos();
    return res.status(200).json(paquetes);
  } catch (error) {
    return res.status(500).json({
      mensaje: error.message,
    });
  }
};

paqueteTuristicoController.getPaqueteTuristico = async (req, res) => {
  try {
    const paquete = await paqueteTuristicoService.findPaqueteTuristico(
      req.params.id
    );
    return res.status(200).json(paquete);
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

paqueteTuristicoController.updatePaqueteTuristico = async (req, res) => {
  try {
    const paquete = await paqueteTuristicoService.editPaqueteTuristico(
      req.params.id,
      req.body
    );
    return res.status(200).json(paquete);
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

paqueteTuristicoController.deletePaqueteTuristico = async (req, res) => {
  try {
    await paqueteTuristicoService.deletePaqueteTuristico(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

module.exports = paqueteTuristicoController;
