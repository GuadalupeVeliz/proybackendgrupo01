const authService = require('../services/auth.service');

const authController = {};

authController.signUp = async (req, res) => {
  try {
    const { token, usuario } = await authService.signUp(req.body);
    const { clave, ...usuarioWithoutClave } = usuario.toJSON();
    return res.status(201).json({
      success: true,
      data: { token: token, usuario: usuarioWithoutClave },
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

authController.login = async (req, res) => {
  try {
    const { token, rol } = await authService.login(req.body.correoElectronico, req.body.clave);

    return res.status(200).json({
      success: true,
      data: { token: token, rol: rol },
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
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
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = authController;
