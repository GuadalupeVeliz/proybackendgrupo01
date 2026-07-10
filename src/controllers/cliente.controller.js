const auditoriaService = require('../services/auditoria.service');
const clienteService = require('../services/cliente.service');

const clienteController = {};

clienteController.createCliente = async (req, res) => {
  try {
    const cliente = await clienteService.addCliente(req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Cliente',
          resultado: 'OK',
          entidadId: cliente.id,
        })
    return res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Cliente',
          resultado: 'Error',
          detalleError:error.message
        })
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

clienteController.getClientes = async (req, res) => {
  try {
    const clientes = await clienteService.findClientes();
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Cliente',
          resultado: 'OK',
        })
    return res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Cliente',
          resultado: 'Error',
          detalleError:error.message
        })
    return res.status(500).json({
      mensaje: error.message,
    });
  }
};

clienteController.getClienteById = async (req, res) => {
  try {
    const cliente = await clienteService.findClienteById(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Cliente',
          resultado: 'OK',
          entidadId: req.params.id,
        })
    return res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Cliente',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

clienteController.updateCliente = async (req, res) => {
  try {
    const cliente = await clienteService.editCliente(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Cliente',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Cliente',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

clienteController.deleteCliente = async (req, res) => {
  try {
    await clienteService.deleteCliente(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Cliente',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Cliente',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

module.exports = clienteController;
