const googleAuthService = require('../services/google.auth.service');

const googleAuthController = {};

googleAuthController.signup = async (req, res) => {
  try {
    const { credential } = req.body;
    const { token, email, name, picture } = await googleAuthService.signup(credential);

    res.status(200).json({ token, email, name, picture });
  } catch (error) {
    console.error('Error en /signup:', error.message);
    res.status(401).json({ error: 'Token de Google inválido' });
  }
};

googleAuthController.signin = async (req, res) => {
  try {
    const { credential } = req.body;
    const { token, email, ...payload } = await googleAuthService.signin(credential);

    return res.status(200).json({
      success: true,
      data: { token, email, ...payload },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      success: false,
      error: error.mesagge
    });
  }
};

module.exports = googleAuthController;