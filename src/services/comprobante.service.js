const {
  Comprobante,
  Reserva,
  Cliente,
  Vacante,
  PaqueteTuristico,
} = require('../models');

const vacanteService = require('./vacante.service');

const comprobanteService = {};

comprobanteService.findComprobantesByCliente = async (clienteId) => {
  if (!clienteId) {
    throw new Error('El ID del cliente es requerido.');
  }

  return await Comprobante.findAll({
    where: { activo: true },
    include: [
      {
        model: Reserva,
        as: 'reserva',
        required: true,
        include: [
          {
            model: Cliente,
            as: 'cliente',
            where: { id: clienteId, activo: true },
          },
          {
            model: Vacante,
            as: 'vacante',
            include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }],
          },
        ],
      },
    ],
  });
};

comprobanteService.findComprobanteData = async (comprobanteId) => {
  if (!comprobanteId) {
    throw new Error('El ID del comprobante es requerido.');
  }

  const comprobante = await Comprobante.findOne({
    where: { id: comprobanteId, activo: true },
    include: [
      {
        model: Reserva,
        as: 'reserva',
        include: [
          { model: Cliente, as: 'cliente' },
          {
            model: Vacante,
            as: 'vacante',
            include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }],
          },
        ],
      },
    ],
  });

  if (!comprobante) {
    throw new Error('Comprobante no encontrado o inactivo.');
  }

  return comprobante;
};

comprobanteService.processCancelacion = async (reservaId) => {
  if (!reservaId) {
    throw new Error('El reservaId es obligatorio.');
  }

  const reserva = await Reserva.findByPk(reservaId);

  if (!reserva) {
    throw new Error('Reserva no encontrada.');
  }

  if (reserva.estado === 'cancelada') {
    throw new Error('La reserva ya se encuentra cancelada.');
  }

  await reserva.update({ estado: 'cancelada' });

  await vacanteService.restaurarCupo(
    reserva.vacanteId,
    reserva.cantidadPersonas
  );

  const comprobante = await Comprobante.create({
    numero: `CAN-${reserva.id}-${Date.now()}`,
    fechaEmision: new Date(),
    tipo: 'cancelacion',
    reservaId: reservaId,
  });

  return comprobante;
};

comprobanteService.findComprobantes = async () => {
  return await Comprobante.findAll({
    where: { activo: true },
    include: [{ model: Reserva, as: 'reserva' }],
    order: [['createdAt', 'DESC']],
  });
};

comprobanteService.findComprobante = async (id) => {
  if (!id) throw new Error('El ID del comprobante es requerido.');

  const comprobante = await Comprobante.findOne({
    where: { id, activo: true },
    include: [{ model: Reserva, as: 'reserva' }],
  });

  if (!comprobante) throw new Error('Comprobante no encontrado.');
  return comprobante;
};

comprobanteService.addComprobante = async (data) => {
  return await Comprobante.create(data);
};

comprobanteService.editComprobante = async (id, data) => {
  if (!id) throw new Error('El ID del comprobante es requerido.');

  const comprobante = await Comprobante.findOne({
    where: { id, activo: true },
  });
  if (!comprobante) throw new Error('Comprobante no encontrado.');

  return await comprobante.update(data);
};

comprobanteService.deleteComprobante = async (id) => {
  if (!id) throw new Error('El ID del comprobante es requerido.');

  const comprobante = await Comprobante.findOne({
    where: { id, activo: true },
  });
  if (!comprobante) throw new Error('Comprobante no encontrado.');

  return await comprobante.update({ activo: false });
};

module.exports = comprobanteService;
