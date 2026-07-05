const { PaqueteTuristico, Vacante } = require('../models');
const { Op } = require('sequelize');

const paqueteTuristicoService = {};

paqueteTuristicoService.addPaqueteTuristico = async (data) => {
  const existingPaqueteTuristico = await PaqueteTuristico.findOne({
    where: { nombre: data.nombre },
  });

  if (existingPaqueteTuristico) {
    throw new Error(
      'El nombre ya está registrado (puede que pertenezca a un paquete turístico dado de baja).'
    );
  }

  return await PaqueteTuristico.create(data);
};

paqueteTuristicoService.findPaquetesTuristicos = async (
  filters = { estado: 'disponible', eliminado: false }
) => {
  return await PaqueteTuristico.findAll({
    where: filters,
    include: { model: Vacante, as: 'vacantes' },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

paqueteTuristicoService.findPaqueteTuristicoById = async (id) => {
  const existingPaqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!existingPaqueteTuristico) {
    throw new Error('Paquete turístico no encontrado, no disponible o dado de baja.');
  }

  return existingPaqueteTuristico;
};

paqueteTuristicoService.editPaqueteTuristico = async (id, updates) => {
  const existingPaqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
  });

  if (!existingPaqueteTuristico) {
    throw new Error('Paquete turístico no encontrado, no disponible o dado de baja.');
  }

  const duracionEnDiasChanged = updates.duracionEnDias !== existingPaqueteTuristico.duracionDias;

  if (updates.duracionEnDias != null && duracionEnDiasChanged) {
    const vacanteAssociated = await Vacante.findOne({
      where: { paqueteTuristicoId: id, estado: 'disponible', eliminado: false },
    });

    if (vacanteAssociated) {
      const vacanteHasReservas = vacanteAssociated.cupoDisponible < vacanteAssociated.cupoTotal;

      if (vacanteHasReservas) {
        throw new Error(
          'No se puede modificar la duración del paquete porque ya existen reservas asociadas.'
        );
      }
    }
  }

  if (updates.nombre) {
    const existingNombre = await PaqueteTuristico.findOne({
      where: {
        nombre: updates.nombre,
        estado: 'disponible',
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (existingNombre) {
      throw new Error(
        'El nombre ya está registrado (puede que pertenezca a un paquete turístico dado de baja).'
      );
    }
  }

  return await existingPaqueteTuristico.update(updates);
};

paqueteTuristicoService.deletePaqueteTuristico = async (id) => {
  const existingPaqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
  });

  if (!existingPaqueteTuristico) {
    throw new Error('Paquete no encontrado, no disponible o dado de baja.');
  }

  return await existingPaqueteTuristico.update({ estado: 'disponible', eliminado: true });
};

module.exports = paqueteTuristicoService;
