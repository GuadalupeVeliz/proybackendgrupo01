const perfilService = require('../services/perfil.service');

const perfilController = {};

perfilController.getPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuarioLogged.id;
    const perfil = await perfilService.obtenerPerfilConDetalles(usuarioId);
    return res.status(200).json(perfil);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

perfilController.updatePerfil = async (req, res) => {
  try {
    const usuarioId = req.usuarioLogged.id;
    const perfilActualizado = await perfilService.actualizarPerfilSeguro(
      usuarioId,
      req.body
    );
    return res.status(200).json({
      mensaje: 'Perfil actualizado correctamente.',
      perfil: perfilActualizado,
    });
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
};

module.exports = perfilController;
