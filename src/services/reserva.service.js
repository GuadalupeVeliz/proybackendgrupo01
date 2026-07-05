const { Vacante, Reserva, Cliente, PaqueteTuristico, Comprobante } = require('../models');
const vacanteService = require('./vacante.service');

const reservaService = {};

reservaService.addReserva = async (data) => {
  const existingVacante = await Vacante.findOne({
    where: { id: data.vacanteId, estado: 'disponible', eliminado: false },
    include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
  });

  if (!existingVacante) {
    throw new Error('La vacante no encontrada o dada de baja.');
  }

  const existingCliente = await Cliente.findByPk(data.clienteId);
  if (!existingCliente) {
    throw new Error('Cliente no encontrado o dada de baja.');
  }

  if (data.cantidadDePersonas <= 0) {
    throw new Error('La cantidad de personas debe ser mayor a 0.');
  }

  // TODO: Buscar un mejor nombre para checkAvailability ya que representa si
  // existe cupos disponibles, cuantos cupos disponibles quedan y cuantos cupos se solicito.
  const disponibilidad = await vacanteService.checkAvailability(
    data.vacanteId,
    data.cantidadDePersonas
  );

  if (!disponibilidad.estaDisponible) {
    throw new Error(`No quedan cupos disponibles (${disponibilidad.cuposDisponibles})`);
  }

  const reserva = await Reserva.create(data);

  await vacanteService.decreaseCupoDisponible(data.vacanteId, data.cantidadDePersonas);

  return reserva;
};

reservaService.findReservas = async (filters = { eliminado: false }) => {
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
    where: filters,
    order: [['createdAt', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

reservaService.findReservaById = async (id) => {
  const existingReserva = await Reserva.findOne({
    where: { id: id, eliminado: false },
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

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  return existingReserva;
};

reservaService.editReservas = async (id, data) => {
  const existingReserva = await Reserva.findByPk(id);

  if (!existingReserva) {
    throw new Error('Reserva no existe.');
  }

  if (existingReserva.eliminado) {
    throw new Error('No se puede modificar una reserva eliminada.');
  }

  if (existingReserva.estado === 'cancelada') {
    throw new Error('No se puede modificar una reserva que ya fue cancelada.');
  }

  if (data.clienteId) {
    const existingCliente = await Cliente.findByPk(data.clienteId);

    if (!existingCliente) {
      throw new Error('Cliente no registrado.');
    }
  }

  const newVacanteId = data.vacanteId ?? existingReserva.vacanteId;
  const newCantidadDePersonas = data.cantidadDePersonas ?? existingReserva.cantidadDePersonas;

  if (data.cantidadDePersonas != null || data.vacanteId != null) {
    await vacanteService.restoreCupoDisponible(
      existingReserva.vacanteId,
      existingReserva.cantidadDePersonas
    );

    const disponibilidad = await vacanteService.checkAvailability(
      newVacanteId,
      newCantidadDePersonas
    );

    if (!disponibilidad.estaDisponible) {
      await vacanteService.decreaseCupoDisponible(
        existingReserva.vacanteId,
        existingReserva.cantidadDePersonas
      );
      throw new Error(
        `No hay suficientes cupos. Solicitados: ${disponibilidad.cuposSolicitados}, Disponibles: ${disponibilidad.cuposDisponibles}`
      );
    }

    await vacanteService.decreaseCupoDisponible(newVacanteId, newCantidadDePersonas);
  }

  return await existingReserva.update({
    clienteId: data.clienteId ?? existingReserva.clienteId,
    vacanteId: newVacanteId,
    cantidadDePersonas: newCantidadDePersonas,
    fechaDeReservacion: data.fechaDeReservacion ?? existingReserva.fechaDeReservacion,
  });
};

reservaService.deleteReserva = async (reservaId) => {
  const existingReserva = await Reserva.findByPk(reservaId);

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  if (existingReserva.eliminado) {
    throw new Error('La reserva ya fue eliminada previamente.');
  }

  if (existingReserva.estado !== 'cancelada') {
    await vacanteService.restoreCupoDisponible(
      existingReserva.vacanteId,
      existingReserva.cantidadDePersonas
    );
  }

  return await existingReserva.update({
    estado: 'cancelada',
    eliminado: true,
  });
};

reservaService.findReservasByClienteId = async (id) => {
  return await Reserva.findAll({
    where: { clienteId: id, eliminado: false },
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

reservaService.checkoutReserva = async (id, data) => {
  const existingReserva = await Reserva.findOne({
    where: { id: id, eliminado: false },
    include: {
      model: Vacante,
      as: 'vacante',
      include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
    },
  });

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  if (existingReserva.estado === 'confirmada') {
    throw new Error('La reserva ya está confirmada.');
  }

  if (existingReserva.estado === 'cancelada') {
    throw new Error('No se puede confirmar una reserva que fue cancelada.');
  }

  if (!data.montoPagado) {
    throw new Error('Debe ingresar el monto a pagar para confirmar.');
  }

  // TODO: Representar mejor el computo del precio total a pagar; cantidad de personas por el precio base y
  // el monto que se quiere abonar.
  const precioPerCliente = parseFloat(existingReserva.vacante.paqueteTuristico.precio);
  const montoAPagar = precioPerCliente * existingReserva.cantidadDePersonas;
  const montoPagado = parseFloat(data.montoPagado);

  if (Number.isNaN(montoPagado)) {
    throw new Error('El monto ingresado no es válido.');
  }

  if (montoPagado < montoAPagar) {
    throw new Error(
      `Monto a pagar ingresado insuficiente. El costo total para ${existingReserva.cantidadDePersonas} personas es de $${montoAPagar.toFixed(2)}.`
    );
  }

  const updatedReserva = await existingReserva.update({
    estado: 'confirmada',
    montoPagado: data.montoPagado,
  });

  const existingComprobante = await Comprobante.findOne({
    where: { reservaId: existingReserva.id },
  });

  if (!existingComprobante) {
    await Comprobante.create({
      numero: `FAC-${existingReserva.id}-${Date.now()}`,
      tipo: 'reserva',
      reservaId: existingReserva.id,
    });
  }

  return updatedReserva;
};

reservaService.cancelReserva = async (id) => {
  const existingReserva = await Reserva.findByPk(id);

  if (!existingReserva) {
    throw new Error('Reserva no encontrada o dada de baja.');
  }

  if (existingReserva.estado === 'cancelada') {
    throw new Error('La reserva ya se encuentra cancelada.');
  }

  await vacanteService.restoreCupoDisponible(
    existingReserva.vacanteId,
    existingReserva.cantidadDePersonas
  );

  return await existingReserva.update({ estado: 'cancelada' });
};

module.exports = reservaService;
