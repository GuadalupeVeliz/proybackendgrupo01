const { Empleado } = require('../models');
const { Op } = require('sequelize');

const empleadoService = {};

empleadoService.addEmpleado = async (data, transaction = null) => {
  const existingLegajo = await Empleado.findOne({
    where: { legajo: data.legajo, eliminado: false },
    transaction,
  });
  if (existingLegajo) throw new Error('El legajo se encuentra registrado.');
  return await Empleado.create(data, { transaction });
};

empleadoService.findEmpleados = async (filters = { eliminado: false }) => {
  return await Empleado.findAll({
    where: filters,
  });
};

empleadoService.findEmpleadoById = async (id) => {
  const empleadoEncontrado = await Empleado.findOne({
    where: { id: id, eliminado: false },
  });

  if (!empleadoEncontrado) {
    throw new Error('Empleado no encontrado o dado de baja.');
  }

  return empleadoEncontrado;
};

empleadoService.editEmpleado = async (id, actualizaciones) => {
  const empleadoEncontrado = await Empleado.findOne({
    where: { id: id, eliminado: false },
  });

  if (!empleadoEncontrado) {
    throw new Error('Empleado no encontrado o dado de baja.');
  }

  if (actualizaciones.legajo) {
    const legajoEncontrado = await Empleado.findOne({
      where: {
        legajo: actualizaciones.legajo,
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (legajoEncontrado) {
      throw new Error('El legajo ya se encuentra registrado por otro empleado.');
    }
  }

  return await empleadoEncontrado.update(actualizaciones);
};

empleadoService.deleteEmpleado = async (id) => {
  const empleadoEncontrado = await Empleado.findOne({
    where: { id: id, eliminado: false },
  });

  if (!empleadoEncontrado) {
    throw new Error('Empleado no encontrado o ya eliminado.');
  }

  return await empleadoEncontrado.update({ eliminado: true });
};

module.exports = empleadoService;
