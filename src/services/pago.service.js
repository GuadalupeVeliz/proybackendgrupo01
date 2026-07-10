const { Pago, Reserva, Comprobante } = require('../models');
const comprobanteService = require('./comprobante.service');

const pagoService = {};

pagoService.addPago = async (data) => {
  if (!data.reservaId || !data.monto || !data.metodoPago) {
    throw new Error('Los campos reservaId, monto y metodoPago son obligatorios.');
  }

  const existingReserva = await Reserva.findByPk(data.reservaId);

  if (!existingReserva) {
    throw new Error('La reserva asociada no existe.');
  }

  if (existingReserva.estado === 'cancelada') {
    throw new Error('No se puede registrar un pago para una reserva cancelada.');
  }

  const pagoManual = await Pago.create({
    fecha: data.fecha || new Date(),
    monto: data.monto,
    metodoPago: data.metodoPago.toUpperCase(),
    estado: data.estado || 'pagado',
    reservaId: data.reservaId,
  });

  if (pagoManual.estado === 'pagado') {
    await existingReserva.update({ estado: 'confirmada', montoPagado: data.monto });

    await comprobanteService.addComprobanteReserva(existingReserva.id);
  }

  return pagoManual;
};

pagoService.findPagos = async (filters = { eliminado: false }) => {
  return await Pago.findAll({
    where: filters,
    include: [{ model: Reserva, as: 'reserva' }],
    order: [['createdAt', 'DESC']],
  });
};

pagoService.findPagoById = async (id) => {
  if (!id) {
    throw new Error('El ID del pago es requerido.');
  }

  const existingPago = await Pago.findOne({
    where: { id: id, eliminado: false },
    include: [{ model: Reserva, as: 'reserva' }],
  });

  if (!existingPago) {
    throw new Error('Pago no encontrado.');
  }

  return existingPago;
};

pagoService.editPago = async (id, updates) => {
  if (!id) {
    throw new Error('El ID del pago es requerido.');
  }
  const existingPago = await Pago.findByPk(id);

  if (!existingPago) {
    throw new Error('Pago no encontrado.');
  }

  if (updates.metodoPago) {
    updates.metodoPago = updates.metodoPago.toUpperCase();
  }

  return await existingPago.update(updates);
};

pagoService.deletePago = async (id) => {
  if (!id) {
    throw new Error('El ID del pago es requerido.');
  }
  const existingPago = await Pago.findOne({ where: { id: id, eliminado: false } });

  if (!existingPago) {
    throw new Error('Pago no encontrado o ya fue eliminado.');
  }

  const existingReserva = await Reserva.findByPk(existingPago.reservaId);

  if (existingReserva && existingReserva.estado === 'confirmada') {
    await existingReserva.update({ estado: 'pendiente', montoPagado: 0.0 });

    await comprobanteService.addComprobanteCancelacion(existingReserva.id);
  }

  return await existingPago.update({ estado: 'pendiente', eliminado: true });
};

module.exports = pagoService;
