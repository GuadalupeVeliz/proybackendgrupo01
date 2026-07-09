const auditoriaService = require("../services/auditoria.service");

const auditoriaController = {};

auditoriaController.getAuditorias = async (req,res) => {
    try{
    const auditorias = await auditoriaService.buscarAuditorias(req.query);
    return res.status(200).json({ success: true, data: auditorias });
    } catch (error) {
        return res.status(500).json({
            mensaje: error.message,
        });
    }
};

module.exports = auditoriaController;