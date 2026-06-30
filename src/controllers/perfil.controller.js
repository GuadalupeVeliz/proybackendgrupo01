const usuarioService = require('../services/usuario.service')

const perfilController = {}

perfilController.getPerfil = async (req, res) => {
    try {
        const usuarioId = req.usuarioLogged.usuarioId;
        const usuario = await usuarioService.findUsuario(usuarioId);
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

perfilController.updatePerfil = async (req, res) => {
    try {
        const usuarioId = req.usuarioLogged.usuarioId;
        const usuario = await usuarioService.editUsuario(usuarioId, req.body);
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = perfilController;