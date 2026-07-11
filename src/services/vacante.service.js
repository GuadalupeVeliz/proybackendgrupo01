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

  return await Vacante.create({ ...data, cupoDisponible: data.cupoTotal });
};

vacanteService.findVacantes = async (filters = { estado: 'disponible', eliminado: false }) => {
  return await Vacante.findAll({
    where: filters,
    include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
    order: [['fechaDeSalida', 'ASC']],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

vacanteService.findVacanteById = async (id) => {
  const vacante = await Vacante.findOne({
    where: { id, estado: 'disponible', eliminado: false },
    include: { model: PaqueteTuristico, as: 'paqueteTuristico' },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!vacante) {
    throw new Error('Vacante no encontrada o dada de baja.');
  }

  return vacante;
};

vacanteService.editVacante = async (id, data) => {
  const vacante = await vacanteService.findVacanteById(id);

  if (data.fechaDeSalida) {
    const conflictFechaDeSalida = await Vacante.findOne({
      where: {
        paqueteTuristicoId: vacante.paqueteTuristicoId,
        fechaDeSalida: data.fechaDeSalida,
        estado: 'disponible',
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (conflictFechaDeSalida) {
      throw new Error('Ya existe una vacante para ese paquete turístico y fecha de salida.');
    }
  }

  const reservedCupos = vacante.cupoTotal - vacante.cupoDisponible;
  const newCupoTotal = data.cupoTotal ?? vacante.cupoTotal;

  if (newCupoTotal < reservedCupos) {
    throw new Error(
      `No puedes asignar un cupo total de ${newCupoTotal} porque ya existen ${reservedCupos} reservas asociadas.`,
    );
  }

  return await vacante.update({
    ...data,
    cupoTotal: newCupoTotal,
    cupoDisponible: newCupoTotal - reservedCupos,
  });
};

vacanteService.deleteVacante = async (id) => {
  const vacante = await vacanteService.findVacanteById(id);
  if (vacante.cupoDisponible < vacante.cupoTotal) {
    throw new Error('No se puede dar de baja una vacante que ya posee reservas asociadas.');
  }
  return await vacante.update({ eliminado: true });
};

vacanteService.checkAvailability = async (id, quantity) => {
  const vacante = await vacanteService.findVacanteById(id);
  return {
    estaDisponible: vacante.cupoDisponible >= quantity,
    cuposDisponibles: vacante.cupoDisponible,
    cuposSolicitados: quantity,
  };
};

vacanteService.decreaseCupoDisponible = async (id, quantity) => {
  const vacante = await vacanteService.findVacanteById(id);
  if (vacante.cupoDisponible < quantity) {
    throw new Error(
      `No hay suficientes cupos. Disponibles: ${vacante.cupoDisponible}, solicitados: ${quantity}.`,
    );
  }
  return await vacante.update({ cupoDisponible: vacante.cupoDisponible - quantity });
};

vacanteService.restoreCupoDisponible = async (id, quantity, transaction) => {
  const vacante = await vacanteService.findVacanteById(id);
  const newCupos = vacante.cupoDisponible + quantity;
  if (newCupos > vacante.cupoTotal) {
    throw new Error(
      `No se pueden restaurar ${quantity} cupos porque superarías el cupo total (${vacante.cupoTotal}).`,
    );
  }
  return await vacante.update({ cupoDisponible: newCupos }, { transaction });
};

vacanteService.actualizarCuposPorReserva = async (
  oldVacanteId,
  oldCantidad,
  newVacanteId,
  newCantidad,
) => {
  if (oldVacanteId && oldCantidad) {
    await vacanteService.restoreCupoDisponible(oldVacanteId, oldCantidad);
  }
  const disponibilidad = await vacanteService.checkAvailability(newVacanteId, newCantidad);
  if (!disponibilidad.estaDisponible) {
    if (oldVacanteId && oldCantidad) {
      await vacanteService.decreaseCupoDisponible(oldVacanteId, oldCantidad);
    }
    throw new Error(
      `No hay suficientes cupos. Solicitados: ${disponibilidad.cuposSolicitados}, disponibles: ${disponibilidad.cuposDisponibles}.`,
    );
  }
  await vacanteService.decreaseCupoDisponible(newVacanteId, newCantidad);
};

module.exports = vacanteService;
