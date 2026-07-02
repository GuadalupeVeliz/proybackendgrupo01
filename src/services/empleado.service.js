const { Empleado } = require('../models');
const { Op } = require('sequelize');

const empleadoService = {};

empleadoService.addEmpleado = async (datosEmpleado) => {
  const legajo = await Empleado.findOne({
    where: {
      legajo: datosEmpleado.legajo,
      activo: true,
    },
  });

  if (legajo) {
    throw new Error('El legajo se encuentra registrado.');
  }

  return await Empleado.create(datosEmpleado);
};

empleadoService.findEmpleados = async () => {
  return await Empleado.findAll({
    where: { activo: true },
  });
};

empleadoService.findEmpleado = async (empleadoId) => {
  const empleado = await Empleado.findOne({
    where: { id: empleadoId, activo: true },
  });

  if (!empleado) {
    throw new Error('Empleado no encontrado o dado de baja.');
  }

  return empleado;
};

empleadoService.editEmpleado = async (empleadoId, datosEmpleado) => {
  const empleado = await Empleado.findOne({
    where: { id: empleadoId, activo: true },
  });

  if (!empleado) {
    throw new Error('Empleado no encontrado o dado de baja.');
  }

  if (datosEmpleado.legajo) {
    const dupplicatedLegajo = await Empleado.findOne({
      where: {
        legajo: datosEmpleado.legajo,
        activo: true,
        id: { [Op.ne]: empleadoId },
      },
    });

    if (dupplicatedLegajo) {
      throw new Error(
        'El legajo ya se encuentra registrado por otro empleado.'
      );
    }
  }

  return await empleado.update(datosEmpleado);
};

empleadoService.deleteEmpleado = async (empleadoId) => {
  const empleado = await Empleado.findOne({
    where: { id: empleadoId, activo: true },
  });

  if (!empleado) {
    throw new Error('Empleado no encontrado o ya eliminado.');
  }

  return await empleado.update({ activo: false });
};

module.exports = empleadoService;
