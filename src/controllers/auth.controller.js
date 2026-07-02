const authService = require('../services/auth.service');

const authController = {};

authController.registerUsuario = async (req, res) => {
  try {
    const registro = await authService.registerUsuario(req.body);
    return res.status(201).json(registro);
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

authController.loginUsuario = async (req, res) => {
  try {
    const { token, rol } = await authService.loginUsuario(
      req.body.correoElectronico,
      req.body.contrasena
    );

    return res.status(200).json({
      token,
      rol,
    });
  } catch (error) {
    return res.status(401).json({
      mensaje: error.message,
    });
  }
};

authController.logoutUsuario = async (req, res) => {
  try {
    return res.status(200).json({
      mensaje: 'Sesión cerrada.',
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: error.message,
    });
  }
};

authController.googleCallback = async (req, res) => {
  try {
    const token = authService.generarTokenGoogle(req.user);

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al generar la sesión' });
  }
};

module.exports = authController;
