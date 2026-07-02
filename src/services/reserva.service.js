const {
  Vacante,
  Reserva,
  Cliente,
  PaqueteTuristico,
  Comprobante,
} = require('../models');
const vacanteService = require('./vacante.service');

const reservaService = {};

reservaService.addReserva = async (datosReserva) => {
  if (
    !datosReserva.fechaReservacion ||
    !datosReserva.clienteId ||
    !datosReserva.vacanteId ||
    !datosReserva.cantidadPersonas
  ) {
    throw new Error(
      'Los campos de Fecha de Reservacion, cantidadPersonas, clienteId y vacanteId se deben completar'
    );
  }

  const cliente = await Cliente.findByPk(datosReserva.clienteId);
  if (!cliente) {
    throw new Error('Cliente no registrado.');
  }

  const vacante = await Vacante.findOne({
    where: { id: datosReserva.vacanteId, activo: true },
    include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
  });
  if (!vacante) {
    throw new Error('La vacante no existe o está dada de baja.');
  }

  const disponibilidad = await vacanteService.consultarDisponibilidad(
    datosReserva.vacanteId,
    datosReserva.cantidadPersonas
  );
  if (!disponibilidad.disponible) {
    throw new Error(
      `No quedan cupos disponibles (${disponibilidad.cupoDisponible})`
    );
  }

  const reserva = await Reserva.create(datosReserva);

  await vacanteService.descontarCupo(
    datosReserva.vacanteId,
    datosReserva.cantidadPersonas
  );

  return reserva;
};

reservaService.findReservas = async () => {
  return await Reserva.findAll({
    include: [
      {
        model: Cliente,
        as: 'cliente',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: Vacante,
        as: 'vacante',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
    where: { activo: true },
    order: [['fechaCreacion', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

reservaService.findReserva = async (reservaId) => {
  const reserva = await Reserva.findOne({
    where: { id: reservaId, activo: true },
  });

  if (!reserva) {
    throw new Error('Reserva no encontrada.');
  }

  return reserva;
};

reservaService.editReservas = async (reservaId, data) => {
  const reserva = await Reserva.findByPk(reservaId);

  if (!reserva) {
    throw new Error('Reserva no existe');
  }

  if (!reserva.activo) {
    throw new Error('No se puede modificar una reserva eliminada.');
  }

  if (reserva.estado === 'cancelada') {
    throw new Error('No se puede modificar una reserva que ya fue cancelada.');
  }

  if (data.clienteId) {
    const cliente = await Cliente.findByPk(data.clienteId);

    if (!cliente) {
      throw new Error('Cliente no registrado');
    }
  }

  const nuevaVacanteId = data.vacanteId ?? reserva.vacanteId;
  const nuevaCantidad = data.cantidadPersonas ?? reserva.cantidadPersonas;

  if (data.cantidadPersonas != null || data.vacanteId != null) {
    await vacanteService.restaurarCupo(
      reserva.vacanteId,
      reserva.cantidadPersonas
    );

    const disponibilidad = await vacanteService.consultarDisponibilidad(
      nuevaVacanteId,
      nuevaCantidad
    );
    if (!disponibilidad.disponible) {
      await vacanteService.descontarCupo(
        reserva.vacanteId,
        reserva.cantidadPersonas
      );
      throw new Error(
        `No hay suficientes cupos. Solicitados: ${nuevaCantidad}, Disponibles: ${disponibilidad.cupoDisponible}`
      );
    }

    await vacanteService.descontarCupo(nuevaVacanteId, nuevaCantidad);
  }

  return await reserva.update({
    clienteId: data.clienteId ?? reserva.clienteId,
    vacanteId: nuevaVacanteId,
    cantidadPersonas: nuevaCantidad,
    fechaReservacion: data.fechaReservacion ?? reserva.fechaReservacion,
  });
};

reservaService.deleteReserva = async (reservaId) => {
  const reserva = await Reserva.findByPk(reservaId);
  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }
  if (!reserva.activo) {
    throw new Error('La reserva ya fue eliminada previamente');
  }

  if (reserva.estado !== 'cancelada') {
    await vacanteService.restaurarCupo(
      reserva.vacanteId,
      reserva.cantidadPersonas
    );
  }

  return await reserva.update({
    activo: false,
    estado: 'cancelada',
  });
};

reservaService.cancelReserva = async (reservaId) => {
  const reserva = await Reserva.findByPk(reservaId);

  if (!reserva) {
    throw new Error('Reserva no encontrada');
  }

  if (reserva.estado === 'cancelada') {
    throw new Error('La reserva ya se encuentra cancelada');
  }

  await vacanteService.restaurarCupo(
    reserva.vacanteId,
    reserva.cantidadPersonas
  );

  return await reserva.update({ estado: 'cancelada' });
};

reservaService.checkoutReserva = async (reservaId, data) => {
  const reserva = await Reserva.findOne({
    where: { id: reservaId, activo: true },
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
    throw new Error('No se puede confirmar una reserva que fue cancelada.');
  }

  if (!data.montoPagado) {
    throw new Error('Debe ingresar el monto para confirmar.');
  }

  const precioUnitario = parseFloat(reserva.vacante.paqueteTuristico.precio);
  const costoTotalEsperado = precioUnitario * reserva.cantidadPersonas;

  if (parseFloat(data.montoPagado) < costoTotalEsperado) {
    throw new Error(
      `Monto insuficiente. El costo total para ${reserva.cantidadPersonas} personas es de $${costoTotalEsperado.toFixed(2)}.`
    );
  }

  const reservaActualizada = await reserva.update({
    estado: 'confirmada',
    montoPagado: data.montoPagado,
  });

  await Comprobante.create({
    numero: `FAC-${reserva.id}-${Date.now()}`,
    fechaEmision: new Date(),
    tipo: 'reserva',
    reservaId: reserva.id,
    activo: true,
  });

  return reservaActualizada;
};

reservaService.findReservasByCliente = async (clienteId) => {
  return await Reserva.findAll({
    where: { clienteId, activo: true },
    include: [
      {
        model: Cliente,
        as: 'cliente',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        model: Vacante,
        as: 'vacante',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

module.exports = reservaService;
