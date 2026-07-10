const usuarioService = require('../services/usuario.service');

const usuarioController = {};

usuarioController.createUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.addUsuario(req.body);
    const { clave, ...usuarioSinClave } = usuario.toJSON();
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Usuario',
          resultado: 'OK',
          entidadId: usuario.id
        });
    return res.status(201).json({ success: true, data: usuarioSinClave });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Usuario',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

usuarioController.getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.findUsuarios();
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Usuario',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: usuarios });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Usuario',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

usuarioController.getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.findUsuarioById(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Usuario',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Usuario',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

usuarioController.updateUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.editUsuario(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Usuario',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Usuario',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

usuarioController.deleteUsuario = async (req, res) => {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Usuario',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Usuario',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = usuarioController;
