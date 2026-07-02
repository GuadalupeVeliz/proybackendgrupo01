const reservaService = require('../services/reserva.service');

const reservaController = {};

reservaController.createReserva = async (req, res) => {
  try {
    const reserva = await reservaService.addReserva(req.body);
    return res.status(201).json({
      mensaje: 'Reserva creada con éxito',
      reserva,
    });
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
};

reservaController.getReservas = async (req, res) => {
  try {
    const reservas = await reservaService.findReservas();
    return res.status(200).json({ reservas });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

reservaController.getReserva = async (req, res) => {
  try {
    const reserva = await reservaService.findReserva(req.params.id);
    return res.status(200).json({ reserva });
  } catch (error) {
    return res.status(404).json({ mensaje: error.message });
  }
};

reservaController.getReservasByCliente = async (req, res) => {
  try {
    const reservas = await reservaService.findReservasByCliente(
      req.params.clienteId
    );
    if (!reservas || reservas.length === 0) {
      return res
        .status(404)
        .json({ mensaje: 'No se encontraron reservas para este cliente' });
    }
    return res.status(200).json({ reservas });
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
};

reservaController.updateReserva = async (req, res) => {
  try {
    const reserva = await reservaService.editReservas(req.params.id, req.body);
    return res.status(200).json({
      mensaje: 'Reserva actualizada con éxito',
      reserva,
    });
  } catch (error) {
    if (
      error.message.includes('no existe') ||
      error.message.includes('no encontrada')
    ) {
      return res.status(404).json({ mensaje: error.message });
    }
    return res.status(400).json({ mensaje: error.message });
  }
};

reservaController.deleteReserva = async (req, res) => {
  try {
    await reservaService.deleteReserva(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ mensaje: error.message });
  }
};

reservaController.cancelReserva = async (req, res) => {
  try {
    const reserva = await reservaService.cancelReserva(req.params.id);
    return res.status(200).json({
      mensaje: 'Reserva cancelada',
      reserva,
    });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ mensaje: error.message });
    }
    return res.status(400).json({ mensaje: error.message });
  }
};

reservaController.checkoutReserva = async (req, res) => {
  try {
    const reserva = await reservaService.checkoutReserva(
      req.params.id,
      req.body
    );
    return res.status(200).json({
      mensaje: 'Reserva confirmada',
      reserva,
    });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ mensaje: error.message });
    }
    return res.status(400).json({ mensaje: error.message });
  }
};

module.exports = reservaController;
