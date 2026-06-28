const vacanteService = require('../services/vacante.service');

const vacanteCtrl = {};

vacanteCtrl.getVacantes = async (req, res) => {
    try {
        const vacantes = await vacanteService.findVacantes();
        res.json(vacantes);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

vacanteCtrl.getVacante = async (req, res) => {
    try {
        const vacante = await vacanteService.findVacante(req.params.id);
        res.json(vacante);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

vacanteCtrl.createVacante = async (req, res) => {
    try {
        const vacante = await vacanteService.addVacante(req.body);
        res.status(201).json(vacante);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

vacanteCtrl.updateVacante = async (req, res) => {
    try {
        const vacante = await vacanteService.editVacante(req.params.id, req.body);
        res.json(vacante);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

vacanteCtrl.deleteVacante = async (req, res) => {
    try {
        await vacanteService.deleteVacante(req.params.id);
        res.json({ message: 'Vacante eliminada correctamente.' });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

module.exports = vacanteCtrl;