const auditoriaService = require("../services/auditoria.service");

const auditoriaController = {};

auditoriaController.getAuditorias = async (req, res) => {
    try {
        const auditorias = await auditoriaService.buscarAuditorias(req.query);
        return res.status(200).json({ success: true, data: auditorias });
    } catch (error) {
        return res.status(500).json({
            mensaje: error.message,
        });
    }
};

auditoriaController.getFiltros = async (req, res) => {
    try {
        const filtros = await auditoriaService.getFiltros();
        return res.status(200).json({ success: true, data: filtros });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = auditoriaController;