const auditoriaService = require('../services/auditoria.service');
const reservaService = require('../services/reserva.service');

const reservaController = {};

reservaController.createReserva = async (req, res) => {
  try {
    const reserva = await reservaService.addReserva(req.body);
    await auditoriaService.registrarCreate(req,{
      accion: 'Crear', 
      modelo: 'Reserva',
      resultado: 'OK',
      entidadId: reserva.id
    })
    return res.status(201).json({ success: true, data: reserva });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Crear', 
      modelo: 'Reserva',
      resultado: 'Error',
      detalleError: error.message
    })
    return res.status(400).json({ success: false, error: error.message });
  }
};

reservaController.getReservas = async (req, res) => {
  try {
    const reservas = await reservaService.findReservas();
    await auditoriaService.registrarCreate(req,{
      accion: 'Consulta', 
      modelo: 'Reserva',
      resultado: 'OK'
    })
    return res.status(200).json({ success: true, data: reservas });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Consulta', 
      modelo: 'Reserva',
      resultado: 'Error',
      detalleError: error.message
    })
    return res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

reservaController.getReservaById = async (req, res) => {
  try {
    const reserva = await reservaService.findReservaById(req.params.id);
    await auditoriaService.registrarCreate(req,{
      accion: 'Consulta', 
      modelo: 'Reserva',
      resultado: 'OK',
      entidadId: req.params.id
    })
    return res.status(200).json({ success: true, data: reserva });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Consulta', 
      modelo: 'Reserva',
      resultado: 'OK',
      entidadId: req.params.id,
      detalleError:error.message
    })
    return res.status(404).json({ success: false, error: error.message });
  }
};

reservaController.updateReserva = async (req, res) => {
  try {
    const reserva = await reservaService.editReservas(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
      accion: 'Modificar', 
      modelo: 'Reserva',
      resultado: 'OK',
      entidadId: reserva.id
    })
    return res.status(200).json({ success: true, data: reserva });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Modificar', 
      modelo: 'Reserva',
      resultado: 'Error',
      entidadId: req.params.id,
      detalleError:error.message
    });
    if (error.message.includes('no existe') || error.message.includes('no encontrada')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(400).json({ success: false, error: error.message });
  }
};

reservaController.deleteReserva = async (req, res) => {
  try {
    await reservaService.deleteReserva(req.params.id);
    await auditoriaService.registrarCreate(req,{
      accion: 'Eliminar', 
      modelo: 'Reserva',
      resultado: 'OK',
      entidadId: req.params.id,
    })
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Eliminar', 
      modelo: 'Reserva',
      resultado: 'Error',
      entidadId: req.params.id,
      detalleError:error.message
    })
    return res.status(404).json({ success: false, error: error.message });
  }
};

reservaController.getReservasByClienteId = async (req, res) => {
  try {
    const reservas = await reservaService.findReservasByClienteId(req.params.clienteId);
    await auditoriaService.registrarCreate(req,{
      accion: 'Consulta', 
      modelo: 'Reserva',
      resultado: 'OK'
    })
    if (!reservas || reservas.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron reservas para este cliente' });
    }
    return res.status(200).json({ success: true, data: reservas });
  } catch (error) {
    await auditoriaService.registrarCreate(req, {
      accion: 'Consulta', 
      modelo: 'Reserva',
      resultado: 'Error',
      detalleError: error.message
    })
    return res.status(400).json({ success: false, error: error.message });
  }
};

reservaController.checkoutReserva = async (req, res) => {
  try {
    // const reserva = await reservaService.checkoutReserva(req.params.id, req.body);
    // await auditoriaService.registrarCreate(req,{
    //   accion: 'Confirmar', 
    //   modelo: 'Reserva',
    //   resultado: 'OK',
    //   entidadId: reserva.id
    // })
    // return res.status(200).json({ success: true, data: reserva });

    const { initPoint } = await reservaService.checkoutReserva(req.params.id);
    return res.status(200).json({ success: true, data: { init_point: initPoint } });

  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Confirmar', 
      modelo: 'Reserva',
      resultado: 'Error',
      entidadId: req.params.id,
      detalleError:error.message
    })
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(400).json({ success: false, error: error.message });
  }
};

reservaController.cancelReserva = async (req, res) => {
  try {
    const reserva = await reservaService.cancelReserva(req.params.id);
    await auditoriaService.registrarCreate(req,{
      accion: 'Cancelar', 
      modelo: 'Reserva',
      resultado: 'OK',
      entidadId: reserva.id
    })
    return res.status(200).json({ success: true, data: reserva });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
      accion: 'Cancelar', 
      modelo: 'Reserva',
      resultado: 'Error',
      entidadId: req.params.id,
      detalleError:error.message
    })
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = reservaController;
