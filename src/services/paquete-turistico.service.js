const { PaqueteTuristico, Vacante } = require('../models');
const { Op } = require('sequelize');
const { traducir } = require('./traductor.service');

const paqueteTuristicoService = {};

paqueteTuristicoService.addPaqueteTuristico = async (data) => {
  const existingPaqueteTuristico = await PaqueteTuristico.findOne({
    where: { nombre: data.nombre, eliminado: false },
  });

  if (existingPaqueteTuristico) {
    throw new Error(
      'El nombre ya está registrado (puede que pertenezca a un paquete turístico dado de baja).',
    );
  }

  // if (existingPaqueteTuristico.eliminado) {
  //   throw new Error('El paquete turístico fue eliminado.');
  // }

  return await PaqueteTuristico.create(data);
};

paqueteTuristicoService.findPaquetesTuristicos = async (
  lang='es'
) => {
  filters = { estado: 'disponible', eliminado: false }
  const paquetes = await PaqueteTuristico.findAll({
    where: filters,
    include: { model: Vacante, as: 'vacantes' },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if(lang!=='es') {
    const paquetesTraducidos = await Promise.all(
      paquetes.map(async (paquete) => {
        const paqueteJSON = paquete.toJSON();
        paqueteJSON.descripcion = await traducir(paqueteJSON.descripcion,lang);
        return paqueteJSON;
      })
    )
    return paquetesTraducidos;
  }
  return paquetes;
};

paqueteTuristicoService.findPaqueteTuristicoById = async (id,lang='es') => {
  const existingPaqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: id, estado: 'disponible', eliminado: false },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  if (!existingPaqueteTuristico) {
    throw new Error('Paquete turístico no encontrado, no disponible o dado de baja.');
  }

  if(lang!=='es') {
    const paqueteTraducido = existingPaqueteTuristico.toJSON();
    paqueteTraducido.descripcion = await traducir(paqueteTraducido.descripcion,lang);
    return paqueteTraducido;
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

  const duracionEnDiasChanged = updates.duracionEnDias !== existingPaqueteTuristico.duracionEnDias;

  if (updates.duracionEnDias != null && duracionEnDiasChanged) {
    const vacanteAssociated = await Vacante.findOne({
      where: { paqueteTuristicoId: id, estado: 'disponible', eliminado: false },
    });

    if (vacanteAssociated) {
      const vacanteHasReservas = vacanteAssociated.cupoDisponible < vacanteAssociated.cupoTotal;

      if (vacanteHasReservas) {
        throw new Error(
          'No se puede modificar la duración del paquete porque ya existen reservas asociadas.',
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
        'El nombre ya está registrado (puede que pertenezca a un paquete turístico dado de baja).',
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

  const reservaActiva = await Reserva.findOne({
    where: {
      estado: {
        [Op.in]: ['pendiente', 'confirmada'],
      },
    },
    include: [
      {
        model: Vacante,
        as: 'vacante',
        where: {
          paqueteTuristicoId: id,
          eliminado: false,
        },
      },
    ],
  });

  if (reservaActiva) {
    throw new Error(
      'No se puede eliminar el paquete porque tiene reservas pendientes o confirmadas.',
    );
  }

  return await existingPaqueteTuristico.update({ eliminado: true });
};

module.exports = paqueteTuristicoService;
