const { Vacante, Reserva, Cliente, PaqueteTuristico, Comprobante } = require('../models');
const vacanteService = require('./vacante.service');
const comprobanteService = require('./comprobante.service');
const { Op } = require('sequelize');

const reservaService = {};

reservaService.addReserva = async (data) => {
  const existingVacante = await Vacante.findOne({
    where: { id: data.vacanteId, estado: 'disponible', eliminado: false },
    include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
  });

  if (!existingVacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
  }

  const existingCliente = await Cliente.findByPk(data.clienteId);

  if (!existingCliente) {
    throw new Error('Cliente no encontrado o dado de baja.');
  }

  if (data.cantidadDePersonas <= 0) {
    throw new Error('La cantidad de personas debe ser mayor a 0.');
  }

  const fechaReservacion = new Date(data.fechaReservacion);
  const fechaSalida = new Date(existingVacante.fechaSalida);

  if (fechaReservacion >= fechaSalida) {
    throw new Error(
      'La fecha de reservación debe ser anterior a la fecha de salida de la vacante.'
    );
  }

  await vacanteService.actualizarCuposPorReserva(
    null,
    null,
    data.vacanteId,
    data.cantidadDePersonas,
  );

  return await Reserva.create({ ...data, estado: 'pendiente' });
};

reservaService.findReservas = async (filters = { eliminado: false }) => {
  return await Reserva.findAll({
    include: [
      { model: Cliente, as: 'cliente', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Vacante, as: 'vacante', attributes: { exclude: ['createdAt', 'updatedAt'] } },
    ],
    where: filters,
    order: [['createdAt', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

reservaService.findReservaById = async (id) => {
  const existingReserva = await Reserva.findOne({
    where: { id, eliminado: false },
    include: [
      { model: Cliente, as: 'cliente', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Vacante, as: 'vacante', attributes: { exclude: ['createdAt', 'updatedAt'] } },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  return existingReserva;
};

reservaService.editReservas = async (id, data) => {
  const existingReserva = await Reserva.findByPk(id);

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  if (existingReserva.eliminado) {
    throw new Error('No se puede modificar una reserva eliminada.');
  }

  if (existingReserva.estado === 'cancelada') {
    throw new Error('No se puede modificar una reserva cancelada.');
  }

  if (data.clienteId) {
    const cliente = await Cliente.findByPk(data.clienteId);

    if (!cliente) {
      throw new Error('Cliente no encontrado o dado de baja.');
    }
  }

  const newVacanteId = data.vacanteId ?? existingReserva.vacanteId;
  const newCantidad = data.cantidadDePersonas ?? existingReserva.cantidadDePersonas;

  if (data.cantidadDePersonas != null || data.vacanteId != null) {
    await vacanteService.actualizarCuposPorReserva(
      existingReserva.vacanteId,
      existingReserva.cantidadDePersonas,
      newVacanteId,
      newCantidad,
    );
  }

  return await existingReserva.update({
    clienteId: data.clienteId ?? existingReserva.clienteId,
    vacanteId: newVacanteId,
    cantidadDePersonas: newCantidad,
    fechaDeReservacion: data.fechaDeReservacion ?? existingReserva.fechaDeReservacion,
  });
};

reservaService.deleteReserva = async (id) => {
  const existingReserva = await Reserva.findByPk(id);

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  if (existingReserva.eliminado) {
    throw new Error('La reserva ya fue eliminada previamente.');
  }
  await vacanteService.restoreCupoDisponible(existingReserva.vacanteId, existingReserva.cantidadDePersonas);
  return await existingReserva.update({ eliminado: true, estado: 'cancelada' });
};

reservaService.findReservasByClienteId = async (id) => {
  return await Reserva.findAll({
    where: { clienteId: id, eliminado: false },
    include: [
      { model: Cliente, as: 'cliente', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Vacante, as: 'vacante', attributes: { exclude: ['createdAt', 'updatedAt'] } },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

reservaService.checkoutReserva = async (id, data) => {
  const reserva = await Reserva.findOne({
    where: { id, eliminado: false },
    include: {
      model: Vacante,
      as: 'vacante',
      include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
    },
  });

  if (!reserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  if (reserva.estado === 'confirmada') {
    throw new Error('La reserva ya está confirmada.');
  }

  if (reserva.estado === 'cancelada') {
    throw new Error('No se puede confirmar una reserva cancelada.');
  }

  if (!data.montoPagado) {
    throw new Error('Debe ingresar el monto a pagar para confirmar.');
  }

  const precioUnitario = parseFloat(reserva.vacante.paqueteTuristico.precioBase);
  const montoTotal = precioUnitario * reserva.cantidadDePersonas;
  const montoPagado = parseFloat(data.montoPagado);

  if (Number.isNaN(montoPagado)) {
    throw new Error('El monto ingresado no es válido.');
  }

  if (montoPagado < montoTotal) {
    throw new Error(`Monto insuficiente. Total: $${montoTotal.toFixed(2)}.`);
  }

  await reserva.update({ estado: 'confirmada', montoPagado });

  await comprobanteService.addComprobanteReserva(reserva.id);

  return reserva;
};

reservaService.cancelReserva = async (id) => {
  const reserva = await Reserva.findByPk(id);

  if (!reserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }
  if (reserva.estado === 'cancelada') {
    throw new Error('La reserva ya se encuentra cancelada.');
  }

  await vacanteService.restoreCupoDisponible(reserva.vacanteId, reserva.cantidadDePersonas);
  await reserva.update({ estado: 'cancelada' });

  await comprobanteService.addComprobanteCancelacion(reserva.id);

  return reserva;
};

reservaService.cancelarReservasVencidas = async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const reservas = await Reserva.findAll({
    where: {
      estado: 'pendiente',
      eliminado: false
    },
    include: [{
      model: Vacante,
      as: 'vacante',
      where: {
        eliminado: false,
        fechaDeSalida: {
          [Op.lt]: hoy
        }
      }
    }]
  });

  for (const reserva of reservas) {
    reserva.estado = 'cancelada';
    await reserva.save();
    await auditoriaService.registrarSistema({
      accion: 'Cancelar Automáticamente',
      modelo: 'Reserva',
      resultado: 'OK',
      idRegistro: reserva.id
    });
  }

  return reservas.length;
};

module.exports = reservaService;
