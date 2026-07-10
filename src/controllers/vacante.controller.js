const vacanteService = require('../services/vacante.service');

const vacanteController = {};

vacanteController.createVacante = async (req, res) => {
  try {
    const vacante = await vacanteService.addVacante(req.body);
    return res.status(201).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

vacanteController.getVacantes = async (req, res) => {
  try {
    const vacantes = await vacanteService.findVacantes();
    return res.status(200).json({ success: true, data: vacantes });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

vacanteController.getVacante = async (req, res) => {
  try {
    const vacante = await vacanteService.findVacanteById(req.params.id);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

vacanteController.updateVacante = async (req, res) => {
  try {
    const vacante = await vacanteService.editVacante(req.params.id, req.body);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

vacanteController.deleteVacante = async (req, res) => {
  try {
    await vacanteService.deleteVacante(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = vacanteController;
