const perfilService = require('../services/perfil.service');

const perfilController = {};

perfilController.getPerfil = async (req, res) => {
  try {
    const perfil = await perfilService.findPerfil(req.usuarioLogged.id);
    return res.status(200).json({ success: true, data: perfil });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

perfilController.updatePerfil = async (req, res) => {
  try {
    const perfil = await perfilService.editPerfil(req.usuarioLogged.id, req.body);
    return res.status(200).json({ success: true, data: perfil });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = perfilController;
