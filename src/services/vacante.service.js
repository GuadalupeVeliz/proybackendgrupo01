const { Vacante, PaqueteTuristico } = require('../models');
const { Op } = require('sequelize');

const vacanteService = {};

vacanteService.addVacante = async (datosVacante) => {
  const vacante = await Vacante.findOne({
    where: {
      paqueteTuristicoId: datosVacante.paqueteTuristicoId,
      fechaSalida: datosVacante.fechaSalida,
      sucursal: datosVacante.sucursal,
      activo: true,
    },
  });

  if (vacante) {
    throw new Error(
      'Ya existe una vacante para ese paquete turistico, fecha y sucursal.'
    );
  }

  return await Vacante.create(datosVacante);
};

vacanteService.findVacantes = async () => {
  return await Vacante.findAll({
    where: { activo: true },
    include: {
      model: PaqueteTuristico,
      as: 'paqueteTuristico',
    },
    order: [['fechaSalida', 'ASC']],
  });
};

vacanteService.findVacante = async (vacanteId) => {
  const vacante = await Vacante.findOne({
    where: { id: vacanteId, activo: true },
    include: {
      model: PaqueteTuristico,
      as: 'paqueteTuristico',
    },
  });

  if (!vacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
  }

  return vacante;
};

vacanteService.editVacante = async (vacanteId, datosVacante) => {
  const vacante = await Vacante.findOne({
    where: { id: vacanteId, activo: true },
  });

  if (!vacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
  }

  if (datosVacante.fechaSalida || datosVacante.sucursal) {
    const vacanteExistente = await Vacante.findOne({
      where: {
        paqueteTuristicoId: vacante.paqueteTuristicoId,
        fechaSalida: datosVacante.fechaSalida || vacante.fechaSalida,
        sucursal: datosVacante.sucursal || vacante.sucursal,
        activo: true,
        id: { [Op.ne]: vacanteId },
      },
    });

    if (vacanteExistente) {
      throw new Error(
        'Ya existe una vacante para ese paquete, fecha y sucursal.'
      );
    }
  }

  const nuevoCupoTotal =
    datosVacante.cupoTotal != null ? datosVacante.cupoTotal : vacante.cupoTotal;
  const reservados = Math.max(0, vacante.cupoTotal - vacante.cupoDisponible);

  if (datosVacante.cupoTotal != null) {
    if (datosVacante.cupoTotal < reservados) {
      throw new Error(
        `No puedes asignar un cupo total de ${datosVacante.cupoTotal} porque ya existen ${reservados} reservas asociadas.`
      );
    }

    datosVacante.cupoDisponible = datosVacante.cupoTotal - reservados;
  }

  return await vacante.update(datosVacante);
};

vacanteService.deleteVacante = async (vacanteId) => {
  const vacante = await Vacante.findOne({
    where: { id: vacanteId, activo: true },
  });

  if (!vacante) {
    throw new Error('Vacante no encontrada o ya eliminada.');
  }

  if (vacante.cupoDisponible < vacante.cupoTotal) {
    throw new Error(
      'No se puede dar de baja una vacante que ya posee reservas asociadas.'
    );
  }

  return await vacante.update({ activo: false });
};

vacanteService.consultarDisponibilidad = async (vacanteId, cantidad) => {
  const vacante = await vacanteService.findVacante(vacanteId);

  return {
    disponible: vacante.cupoDisponible >= cantidad,
    cupoDisponible: vacante.cupoDisponible,
    cantidadSolicitada: cantidad,
  };
};

vacanteService.descontarCupo = async (vacanteId, cantidad) => {
  const vacante = await vacanteService.findVacante(vacanteId);

  return await vacante.update({
    cupoDisponible: vacante.cupoDisponible - cantidad,
  });
};

vacanteService.restaurarCupo = async (vacanteId, cantidad) => {
  const vacante = await vacanteService.findVacante(vacanteId);

  return await vacante.update({
    cupoDisponible: vacante.cupoDisponible + cantidad,
  });
};

module.exports = vacanteService;
