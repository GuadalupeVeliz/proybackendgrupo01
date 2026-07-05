const paqueteTuristicoService = require('../services/paquete-turistico.service');

const paqueteTuristicoController = {};

paqueteTuristicoController.createPaqueteTuristico = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.addPaqueteTuristico(req.body);
    return res.status(201).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.getPaquetesTuristicos = async (req, res) => {
  try {
    const paquetesTuristicos = await paqueteTuristicoService.findPaquetesTuristicos();
    return res.status(200).json({ success: true, data: paquetesTuristicos });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.getPaqueteTuristicoById = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.findPaqueteTuristicoById(req.params.id);
    return res.status(200).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.updatePaqueteTuristico = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.editPaqueteTuristico(
      req.params.id,
      req.body
    );
    return res.status(200).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.deletePaqueteTuristico = async (req, res) => {
  try {
    await paqueteTuristicoService.deletePaqueteTuristico(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = paqueteTuristicoController;
