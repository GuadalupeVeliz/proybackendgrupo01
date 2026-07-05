const { Vacante, PaqueteTuristico } = require('../models');
const { Op } = require('sequelize');

const vacanteService = {};

vacanteService.addVacante = async (data) => {
  const existingVacante = await Vacante.findOne({
    where: {
      paqueteTuristicoId: data.paqueteTuristicoId,
      fechaDeSalida: data.fechaDeSalida,
      estado: 'disponible',
      eliminado: false,
    },
  });

  if (existingVacante) {
    throw new Error('Ya existe una vacante para ese paquete turístico y fecha de salida.');
  }

  return await Vacante.create(data);
};

vacanteService.findVacantes = async (filters = { estado: 'disponible', eliminado: false }) => {
  return await Vacante.findAll({
    where: filters,
    include: {
      model: PaqueteTuristico,
      as: 'paqueteTuristico',
    },
    order: [['fechaDeSalida', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

vacanteService.findVacanteById = async (id) => {
  const existingVacante = await Vacante.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
    include: {
      model: PaqueteTuristico,
      as: 'paqueteTuristico',
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!existingVacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
    º;
  }

  return existingVacante;
};

vacanteService.editVacante = async (id, data) => {
  const existingVacante = await Vacante.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
  });

  if (!existingVacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
  }

  if (data.fechaDeSalida) {
    const conflictingVacanteByFechaSalida = await Vacante.findOne({
      where: {
        paqueteTuristicoId: existingVacante.paqueteTuristicoId,
        fechaDeSalida: data.fechaDeSalida || existingVacante.fechaDeSalida,
        estado: 'disponible',
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (conflictingVacanteByFechaSalida) {
      throw new Error('Ya existe una vacante para ese paquete turístico y fecha de salida.');
    }
  }

  const updatedCupoTotal = data.cupoTotal != null ? data.cupoTotal : existingVacante.cupoTotal;
  const reservedCupos = Math.max(0, existingVacante.cupoTotal - existingVacante.cupoDisponible);

  if (updatedCupoTotal < reservedCupos) {
    throw new Error(
      `No puedes asignar un cupo total de ${updatedCupoTotal} porque ya existen ${reservedCupos} reservas asociadas.`
    );
  }

  data.cupoDisponible = updatedCupoTotal - reservedCupos;

  return await existingVacante.update(data);
};

vacanteService.deleteVacante = async (id) => {
  const existingVacante = await Vacante.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
  });

  if (!existingVacante) {
    throw new Error('Vacante no encontrada o ya eliminada.');
  }

  if (existingVacante.cupoDisponible < existingVacante.cupoTotal) {
    throw new Error('No se puede dar de baja una vacante que ya posee reservas asociadas.');
  }

  return await existingVacante.update({ eliminado: true });
};

vacanteService.checkAvailability = async (id, quantity) => {
  const existingVacante = await vacanteService.findVacanteById(id);

  return {
    estaDisponible: existingVacante.cupoDisponible >= quantity,
    cuposDisponibles: existingVacante.cupoDisponible,
    cuposSolicitados: quantity,
  };
};

vacanteService.decreaseCupoDisponible = async (id, quantity) => {
  const existingVacante = await vacanteService.findVacanteById(id);

  return await existingVacante.update({
    cupoDisponible: existingVacante.cupoDisponible - quantity,
  });
};

vacanteService.restoreCupoDisponible = async (id, quantity) => {
  const existingVacante = await vacanteService.findVacanteById(id);

  return await existingVacante.update({
    cupoDisponible: existingVacante.cupoDisponible + quantity,
  });
};

module.exports = vacanteService;
