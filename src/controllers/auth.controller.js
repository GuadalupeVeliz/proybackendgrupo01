const authService = require('../services/auth.service');

const authController = {};

authController.signUp = async (req, res) => {
  try {
    const { usuario, ...data } = await authService.signUp(req.body);
    const { clave, ...usuarioSinClave } = usuario.toJSON();

    return res.status(201).json({
      success: true,
      data: { ...data, usuario: usuarioSinClave },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

authController.login = async (req, res) => {
  try {
    const { correoElectronico, clave } = req.body;
    const data = await authService.login(correoElectronico, clave);

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message
    });
  }
};

authController.logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        usuarioId: req.usuarioLogged.id,
        message: 'Sesión cerrada.',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = authController;