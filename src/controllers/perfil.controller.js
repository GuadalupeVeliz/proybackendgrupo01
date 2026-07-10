const perfilService = require('../services/perfil.service');

const perfilController = {};

perfilController.getPerfil = async (req, res) => {
  try {
    const perfil = await perfilService.findPerfil(req.usuarioLogged.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Perfil de Usuario',
          resultado: 'OK',
          entidadId: req.usuarioLogged.id,
        });
    return res.status(200).json({ success: true, data: perfil });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Perfil de Usuario',
          resultado: 'Error',
          entidadId: req.usuarioLogged.id,
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

perfilController.updatePerfil = async (req, res) => {
  try {
    const perfil = await perfilService.editPerfil(req.usuarioLogged.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Perfil de Usuario',
          resultado: 'OK',
          entidadId: req.usuarioLogged.id,
        });
    return res.status(200).json({ success: true, data: perfil });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Perfil de Usuario',
          resultado: 'Error',
          entidadId: req.usuarioLogged.id,
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = perfilController;
