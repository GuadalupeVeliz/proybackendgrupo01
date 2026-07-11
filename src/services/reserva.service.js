const { Vacante, Reserva, Cliente, Empleado, PaqueteTuristico, Comprobante } = require('../models');
const vacanteService = require('./vacante.service');
const comprobanteService = require('./comprobante.service');
const { Op } = require('sequelize');
const pagoService = require('./pago.service');

const reservaService = {};

const empleadoInclude = {
  model: Empleado,
  as: 'gestionadaPor',
  attributes: ['id', 'legajo', 'sede', 'esGerente'],
};

const assertClienteOwnsReserva = (reserva, usuario) => {
  if (usuario.rol === 'Cliente' && reserva.clienteId !== usuario.cliente?.id) {
    throw new Error('No tiene permisos para acceder a una reserva de otro cliente.');
  }
};

reservaService.addReserva = async (data, usuario) => {
  const isCliente = usuario.rol === 'Cliente';
  const clienteId = isCliente ? usuario.cliente?.id : data.clienteId;
  const empleadoId = isCliente ? null : usuario.empleado?.id;

  if (!clienteId) {
    throw new Error(isCliente
      ? 'El usuario autenticado no tiene un cliente asociado.'
      : 'Debe indicar el cliente de la reserva.');
  }

  if (!isCliente && (!empleadoId || usuario.empleado.eliminado)) {
    throw new Error('El usuario autenticado no tiene un empleado activo asociado.');
  }

  const existingVacante = await Vacante.findOne({
    where: { id: data.vacanteId, estado: 'disponible', eliminado: false },
    include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
  });

  if (!existingVacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
  }

  const existingCliente = await Cliente.findOne({ where: { id: clienteId, eliminado: false } });

  if (!existingCliente) {
    throw new Error('Cliente no encontrado o dado de baja.');
  }

  if (data.cantidadDePersonas <= 0) {
    throw new Error('La cantidad de personas debe ser mayor a 0.');
  }

  const fechaReservacion = new Date(data.fechaDeReservacion);
  const fechaSalida = new Date(existingVacante.fechaDeSalida);

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

  const { empleadoId: ignoredEmpleadoId, clienteId: ignoredClienteId, ...reservaData } = data;
  return await Reserva.create({
    ...reservaData,
    clienteId,
    empleadoId,
    estado: 'pendiente',
  });
};

reservaService.findReservas = async (filters = { eliminado: false }) => {
  return await Reserva.findAll({
    include: [
      { model: Cliente, as: 'cliente', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Vacante, as: 'vacante', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      empleadoInclude,
    ],
    where: filters,
    order: [['createdAt', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

reservaService.findReservasForUser = async (usuario) => {
  const filters = { eliminado: false };
  if (usuario.rol === 'Cliente') {
    if (!usuario.cliente?.id) return [];
    filters.clienteId = usuario.cliente.id;
  }
  return reservaService.findReservas(filters);
};

reservaService.findReservaById = async (id) => {
  const existingReserva = await Reserva.findOne({
    where: { id, eliminado: false },
    include: [
      { model: Cliente, as: 'cliente', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Vacante, as: 'vacante', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      empleadoInclude,
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  return existingReserva;
};

reservaService.findReservaByIdForUser = async (id, usuario) => {
  const reserva = await reservaService.findReservaById(id);
  assertClienteOwnsReserva(reserva, usuario);
  return reserva;
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
      empleadoInclude,
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

reservaService.checkoutReserva = async (id) => {
// reservaService.checkoutReserva = async (id, data, usuario) => {
  const reserva = await Reserva.findOne({
    where: { id, eliminado: false },
    include: {
      model: Vacante,
      as: 'vacante',
      include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
    },
  });

  if (!reserva) throw new Error('Reserva no encontrada o dada de baja.');
  if (reserva.estado === 'confirmada') throw new Error('La reserva ya está confirmada.');
  if (reserva.estado === 'cancelada') throw new Error('No se puede pagar una reserva cancelada.');

  const initPoint = await pagoService.iniciarPagoMP(reserva);
  return { initPoint };
};

reservaService.cancelReserva = async (id, usuario) => {
  const reserva = await Reserva.findByPk(id);

  if (!reserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }
  assertClienteOwnsReserva(reserva, usuario);
  if (reserva.estado === 'cancelada') {
    throw new Error('La reserva ya se encuentra cancelada.');
  }

  await vacanteService.restoreCupoDisponible(reserva.vacanteId, reserva.cantidadDePersonas);
  await reserva.update({ estado: 'cancelada' });

  await comprobanteService.addComprobanteCancelacion(reserva.id);

  return { reserva: reserva, id: reserva.id };
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
