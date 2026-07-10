const { Empleado } = require('../models');
const { Op } = require('sequelize');

const empleadoService = {};

empleadoService.addEmpleado = async (data) => {
  const existingLegajo = await Empleado.findOne({
    where: {
      legajo: data.legajo,
      eliminado: false,
    },
  });

  if (existingLegajo) {
    throw new Error('El legajo se encuentra registrado.');
  }

  return await Empleado.create(data);
};

empleadoService.findEmpleados = async (filters = { eliminado: false }) => {
  return await Empleado.findAll({
    where: filters,
  });
};

empleadoService.findEmpleadoById = async (id) => {
  const empleado = await Empleado.findOne({
    where: { id: id, eliminado: false },
  });

  if (!empleado) {
    throw new Error('Empleado no encontrado o dado de baja.');
  }

  return empleado;
};

empleadoService.editEmpleado = async (id, updates) => {
  const existingEmpleado = await Empleado.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingEmpleado) {
    throw new Error('Empleado no encontrado o dado de baja.');
  }

  if (updates.legajo) {
    const existingLegajo = await Empleado.findOne({
      where: {
        legajo: updates.legajo,
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (existingLegajo) {
      throw new Error('El legajo ya se encuentra registrado por otro empleado.');
    }
  }

  return await existingEmpleado.update(updates);
};

empleadoService.deleteEmpleado = async (id) => {
  const existingEmpleado = await Empleado.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingEmpleado) {
    throw new Error('Empleado no encontrado o ya eliminado.');
  }

  return await existingEmpleado.update({ eliminado: true });
};

module.exports = empleadoService;
