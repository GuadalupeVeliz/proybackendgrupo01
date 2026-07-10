const auditoriaService = require('../services/auditoria.service');
const authService = require('../services/auth.service');

const authController = {};

authController.signUp = async (req, res) => {
  try {
    const { usuario, ...data } = await authService.signUp(req.body);
    const { clave, ...usuarioSinClave } = usuario.toJSON();
    await auditoriaService.registrarCreate(req,{
          accion: 'SignUp', 
          modelo: 'Usuario',
          resultado: 'OK',
          entidadId: usuario.id,
        })
    return res.status(201).json({
      success: true,
      data: { ...data, usuario: usuarioSinClave },
    });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Usuario',
          resultado: 'Error',
          detalleError:error.message
        })
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
    await auditoriaService.registrarCreate(req,{
          accion: 'Login', 
          modelo: 'Usuario',
          resultado: 'OK',
        },data.usuarioEncontrado);
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Login', 
          modelo: 'Usuario',
          resultado: 'Error',
          detalleError:error.message
        })
    return res.status(401).json({
      success: false,
      error: error.message
    });
  }
};

authController.logout = async (req, res) => {
  try {
    await auditoriaService.registrarCreate(req,{
          accion: 'Logout', 
          modelo: 'Usuario',
          resultado: 'OK',
        })
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