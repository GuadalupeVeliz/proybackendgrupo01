const googleAuthService = require('../services/google.auth.service');

const googleAuthController = {};

googleAuthController.signup = async (req, res) => {
  try {
    const { credential } = req.body;
    const data = await googleAuthService.signup(credential);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error en google signup:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Token de Google inválido',
    });
  }
};

googleAuthController.signin = async (req, res) => {
  try {
    const { credential } = req.body;
    const data = await googleAuthService.signin(credential);

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('Error en google signin:', error.message);
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = googleAuthController;