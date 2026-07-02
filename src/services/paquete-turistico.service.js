const { PaqueteTuristico, Vacante } = require('../models');
const { Op } = require('sequelize');

const paqueteTuristicoService = {};

paqueteTuristicoService.addPaqueteTuristico = async (datosPaqueteTuristico) => {
  const paqueteTuristico = await PaqueteTuristico.findOne({
    where: {
      nombre: datosPaqueteTuristico.nombre,
    },
  });

  if (paqueteTuristico) {
    throw new Error(
      'El nombre ya está registrado (puede que pertenezca a un paquete dado de baja).'
    );
  }

  return await PaqueteTuristico.create(datosPaqueteTuristico);
};

paqueteTuristicoService.findPaquetesTuristicos = async () => {
  return await PaqueteTuristico.findAll({
    where: { activo: true },
    include: {
      model: Vacante,
      as: 'vacantes',
    },
  });
};

paqueteTuristicoService.findPaqueteTuristico = async (paqueteTuristicoId) => {
  const paqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: paqueteTuristicoId, activo: true },
  });

  if (!paqueteTuristico) {
    throw new Error('Paquete no encontrado o dado de baja.');
  }

  return paqueteTuristico;
};

paqueteTuristicoService.editPaqueteTuristico = async (
  paqueteTuristicoId,
  datosPaqueteTuristico
) => {
  const paqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: paqueteTuristicoId, activo: true },
  });

  if (!paqueteTuristico) {
    throw new Error('Paquete no encontrado o dado de baja.');
  }

  if (
    datosPaqueteTuristico.duracionDias != null &&
    datosPaqueteTuristico.duracionDias !== paqueteTuristico.duracionDias
  ) {
    const vacanteConReservas = await Vacante.findOne({
      where: {
        paqueteTuristicoId,
        activo: true,
      },
    });

    if (
      vacanteConReservas &&
      vacanteConReservas.cupoDisponible < vacanteConReservas.cupoTotal
    ) {
      throw new Error(
        'No se puede modificar la duración del paquete porque ya existen reservas asociadas.'
      );
    }
  }

  if (datosPaqueteTuristico.nombre) {
    const nombreDuplicado = await PaqueteTuristico.findOne({
      where: {
        nombre: datosPaqueteTuristico.nombre,
        activo: true,
        id: { [Op.ne]: paqueteTuristicoId },
      },
    });

    if (nombreDuplicado) {
      throw new Error('El nombre ya está registrado.');
    }
  }

  return await paqueteTuristico.update(datosPaqueteTuristico);
};

paqueteTuristicoService.deletePaqueteTuristico = async (paqueteTuristicoId) => {
  const paqueteTuristico = await PaqueteTuristico.findOne({
    where: { id: paqueteTuristicoId, activo: true },
  });

  if (!paqueteTuristico) {
    throw new Error('Paquete no encontrado o ya eliminado.');
  }

  return await paqueteTuristico.update({ activo: false });
};

module.exports = paqueteTuristicoService;
