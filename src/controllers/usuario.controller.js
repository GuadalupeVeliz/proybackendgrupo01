const usuarioService = require('../services/usuario.service');

const usuarioController = {};

usuarioController.createUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.addUsuario(req.body);
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

usuarioController.getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.findUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

usuarioController.getUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.findUsuario(req.params.id);
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

usuarioController.updateUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.editUsuario(req.params.id, req.body);
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

usuarioController.deleteUsuario = async (req, res) => {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

module.exports = usuarioController;
