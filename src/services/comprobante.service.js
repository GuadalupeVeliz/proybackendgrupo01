const { Comprobante, Reserva, Cliente, Vacante, PaqueteTuristico } = require('../models');
const vacanteService = require('./vacante.service');

const comprobanteService = {};

comprobanteService.addComprobante = async (data) => {
  return await Comprobante.create(data);
};

comprobanteService.findComprobantes = async () => {
  return await Comprobante.findAll({
    where: { eliminado: false },
    include: [{ model: Reserva, as: 'reserva' }],
    order: [['createdAt', 'DESC']],
  });
};

comprobanteService.findComprobanteById = async (id) => {
  if (!id) {
    throw new Error('El ID del comprobante es requerido.');
  }

  const comprobante = await Comprobante.findOne({
    where: { id, eliminado: false },
    include: [{ model: Reserva, as: 'reserva' }],
  });

  if (!comprobante) {
    throw new Error('Comprobante no encontrado.');
  }
  return comprobante;
};

comprobanteService.editComprobante = async (id, data) => {
  if (!id) {
    throw new Error('El ID del comprobante es requerido.');
  }

  const existingComprobante = await Comprobante.findOne({ where: { id, eliminado: false } });

  if (!existingComprobante) {
    throw new Error('Comprobante no encontrado.');
  }

  return await existingComprobante.update(data);
};

comprobanteService.deleteComprobante = async (id) => {
  if (!id) {
    throw new Error('El ID del comprobante es requerido.');
  }

  const existingComprobante = await Comprobante.findOne({ where: { id, eliminado: false } });

  if (!existingComprobante) {
    throw new Error('Comprobante no encontrado.');
  }

  return await existingComprobante.update({ eliminado: true });
};

comprobanteService.addComprobanteReserva = async (reservaId) => {
  const existing = await Comprobante.findOne({
    where: { reservaId, tipo: 'reserva', eliminado: false },
  });

  if (existing) {
    throw new Error('Ya existe un comprobante de reserva para esta operación.');
  }

  return await Comprobante.create({
    numero: `RES-${reservaId}-${Date.now()}`,
    fechaDeEmision: new Date(),
    tipo: 'reserva',
    reservaId,
  });
};

comprobanteService.addComprobanteCancelacion = async (reservaId) => {
  const existing = await Comprobante.findOne({
    where: { reservaId, tipo: 'cancelacion', eliminado: false },
  });
  if (existing) {
    throw new Error('Ya existe un comprobante de cancelación para esta operación.');
  }

  return await Comprobante.create({
    numero: `CAN-${reservaId}-${Date.now()}`,
    fechaDeEmision: new Date(),
    tipo: 'cancelacion',
    reservaId,
  });
};

module.exports = comprobanteService;
