const Empleado = require('../models/empleado.model');

const empleadoService = {};

empleadoService.addEmpleado = async (datosEmpleado) => {
    const empleado = await Empleado.findOne({
        where: {
            legajo: datosEmpleado.legajo,
        },
    });

    if (empleado) {
        throw new Error('El legajo se encuentra registrado.');
    }

    return await Empleado.create(datosEmpleado);
};

empleadoService.findEmpleados = async () => {
    return await Empleado.findAll();
};

empleadoService.findEmpleado = async (empleadoId) => {
    const empleado = await Empleado.findByPk(empleadoId);

    if (!empleado) {
        throw new Error('Empleado no encontrado.');
    }

    return empleado;
};

empleadoService.editEmpleado = async (empleadoId, datosEmpleado) => {
    const empleado = await Empleado.findByPk(empleadoId);

    if (!empleado) {
        throw new Error('Empleado no encontrado.');
    }

    return await empleado.update(datosEmpleado);
};

empleadoService.deleteEmpleado = async (empleadoId) => {
    const empleado = await Empleado.findByPk(empleadoId);

    if (!empleado) {
        throw new Error('Empleado no encontrado.');
    }

    return await empleado.destroy();
};

module.exports = empleadoService;
