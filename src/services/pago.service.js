const {
  Pago,
  Reserva,
  Comprobante,
  Vacante,
  PaqueteTuristico,
} = require('../models');

const pagoService = {};

pagoService.checkoutSession = async (reservaId) => {
  if (!reservaId) {
    throw new Error('El reservaId es obligatorio.');
  }

  const reserva = await Reserva.findByPk(reservaId, {
    include: [
      {
        model: Vacante,
        as: 'vacante',
        include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }],
      },
    ],
  });

  if (!reserva) {
    throw new Error('Reserva no encontrada.');
  }
  if (reserva.estado !== 'pendiente') {
    throw new Error(
      `No se puede pagar una reserva en estado: ${reserva.estado}`
    );
  }

  const precioPaquete = parseFloat(reserva.vacante.paqueteTuristico.precio);
  const costoTotalEsperado = precioPaquete * reserva.cantidadPersonas;

  return {
    reservaId: reserva.id,
    paquete: reserva.vacante.paqueteTuristico.nombre,
    cantidadPersonas: reserva.cantidadPersonas,
    montoTotalAPagar: costoTotalEsperado,
  };
};

pagoService.webhook = async (datosPago) => {
  if (!datosPago.reservaId || !datosPago.monto || !datosPago.metodoPago) {
    throw new Error(
      'Los campos reservaId, monto y metodoPago son obligatorios.'
    );
  }

  const reserva = await Reserva.findByPk(datosPago.reservaId, {
    include: [
      {
        model: Vacante,
        as: 'vacante',
        include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }],
      },
    ],
  });

  if (!reserva) {
    throw new Error('La reserva asociada no existe.');
  }

  if (reserva.estado === 'confirmada') {
    throw new Error('La reserva ya fue pagada y confirmada previamente.');
  }

  if (reserva.estado === 'cancelada') {
    throw new Error('No se puede pagar una reserva cancelada.');
  }

  const precioPaquete = parseFloat(reserva.vacante.paqueteTuristico.precio);
  const costoTotalEsperado = precioPaquete * reserva.cantidadPersonas;

  if (parseFloat(datosPago.monto) < costoTotalEsperado) {
    throw new Error(
      `Monto insuficiente. El costo total para ${reserva.cantidadPersonas} personas es de $${costoTotalEsperado}.`
    );
  }

  const montoFinal = parseFloat(datosPago.monto);

  const nuevoPago = await Pago.create({
    fecha: new Date(),
    monto: montoFinal, // 👈 Pasamos el flotante limpio
    metodoPago: datosPago.metodoPago.toUpperCase(),
    estado: 'pagado',
    reservaId: reserva.id,
  });

  await reserva.update({
    estado: 'confirmada',
    montoPagado: montoFinal,
  });

  const nuevoComprobante = await Comprobante.create({
    numero: `RES-${reserva.id}-${Date.now()}`,
    fechaEmision: new Date(),
    tipo: 'reserva',
    reservaId: reserva.id,
  });

  return {
    pago: nuevoPago,
    reservaEstado: 'confirmada',
    comprobante: nuevoComprobante,
  };
};

pagoService.findPagos = async () => {
  return await Pago.findAll({
    where: { activo: true },
    include: [{ model: Reserva, as: 'reserva' }],
    order: [['createdAt', 'DESC']],
  });
};

pagoService.addPagoManual = async (datosPago) => {
  if (!datosPago.reservaId || !datosPago.monto || !datosPago.metodoPago) {
    throw new Error(
      'Los campos reservaId, monto y metodoPago son obligatorios.'
    );
  }

  const reserva = await Reserva.findByPk(datosPago.reservaId);

  if (!reserva) {
    throw new Error('La reserva asociada no existe.');
  }

  if (reserva.estado === 'cancelada') {
    throw new Error(
      'No se puede registrar un pago para una reserva cancelada.'
    );
  }

  const pagoManual = await Pago.create({
    fecha: datosPago.fecha || new Date(),
    monto: datosPago.monto,
    metodoPago: datosPago.metodoPago.toUpperCase(),
    estado: datosPago.estado || 'pagado',
    reservaId: datosPago.reservaId,
  });

  if (pagoManual.estado === 'pagado') {
    await reserva.update({
      estado: 'confirmada',
      montoPagado: datosPago.monto,
    });

    await Comprobante.create({
      numero: `MAN-${reserva.id}-${Date.now()}`,
      fechaEmision: new Date(),
      tipo: 'reserva',
      reservaId: reserva.id,
    });
  }

  return pagoManual;
};

pagoService.findPago = async (pagoId) => {
  if (!pagoId) {
    throw new Error('El ID del pago es requerido.');
  }

  const pago = await Pago.findByPk(pagoId, {
    include: [{ model: Reserva, as: 'reserva' }],
  });

  if (!pago) {
    throw new Error('Pago no encontrado.');
  }

  return pago;
};

pagoService.editPago = async (pagoId, datosActualizados) => {
  if (!pagoId) {
    throw new Error('El ID del pago es requerido.');
  }

  const pago = await Pago.findByPk(pagoId);
  if (!pago) {
    throw new Error('Pago no encontrado.');
  }

  if (
    datosActualizados.monto != null &&
    parseFloat(datosActualizados.monto) !== parseFloat(pago.monto)
  ) {
    const reserva = await Reserva.findByPk(pago.reservaId);

    if (reserva && reserva.estado === 'confirmada') {
      await reserva.update({ montoPagado: datosActualizados.monto });
    }
  }

  if (datosActualizados.metodoPago) {
    datosActualizados.metodoPago = datosActualizados.metodoPago.toUpperCase();
  }

  return await pago.update(datosActualizados);
};

pagoService.deletePago = async (pagoId) => {
  if (!pagoId) {
    throw new Error('El ID del pago es requerido.');
  }

  const pago = await Pago.findOne({ where: { id: pagoId, activo: true } });
  if (!pago) {
    throw new Error('Pago no encontrado o ya fue eliminado.');
  }

  const reserva = await Reserva.findByPk(pago.reservaId);

  if (reserva && reserva.estado === 'confirmada') {
    await reserva.update({
      estado: 'pendiente',
      montoPagado: 0.0,
    });

    await Comprobante.update(
      { tipo: 'cancelacion' },
      { where: { reservaId: reserva.id, tipo: 'reserva' } }
    );
  }

  return await pago.update({
    activo: false,
    estado: 'pendiente',
  });
};

module.exports = pagoService;
