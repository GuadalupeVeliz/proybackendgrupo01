const Vacante = require('../models/vacante.model');

const vacanteService = {};

vacanteService.consultarDisponibilidad = async (vacanteId, cantidad, transaccion = null) => {
    const vacante = await Vacante.findByPk(vacanteId, {
        transaction: transaccion
    });

    if (!vacante) {
        throw new Error('Vacante no encontrada.');
    }

    if (!cantidad || cantidad <= 0) {
        throw new Error('La cantidad de personas debe ser mayor a cero.');
    }

    return {
        disponible: vacante.cupoDisponible >= cantidad,
        cupoDisponible: vacante.cupoDisponible,
        cantidadSolicitada: cantidad
    };
};

vacanteService.descontarCupo = async (vacanteId, cantidad, transaccion = null) => {
    const vacante = await Vacante.findByPk(vacanteId, {
        transaction: transaccion
    });

    if (!vacante) {
        throw new Error('Vacante no encontrada.');
    }

    if (!cantidad || cantidad <= 0) {
        throw new Error('La cantidad de personas debe ser mayor a cero.');
    }

    if (vacante.cupoDisponible < cantidad) {
        throw new Error('No hay cupos suficientes disponibles.');
    }

    return await vacante.update(
        {
            cupoDisponible: vacante.cupoDisponible - cantidad
        },
        {
            transaction: transaccion
        }
    );
};

vacanteService.restaurarCupo = async (vacanteId, cantidad, transaccion = null) => {
    const vacante = await Vacante.findByPk(vacanteId, {
        transaction: transaccion
    });

    if (!vacante) {
        throw new Error('Vacante no encontrada.');
    }

    if (!cantidad || cantidad <= 0) {
        throw new Error('La cantidad de personas debe ser mayor a cero.');
    }

    const nuevoCupoDisponible = vacante.cupoDisponible + cantidad;

    if (nuevoCupoDisponible > vacante.cupoTotal) {
        throw new Error('No se puede restaurar más cupo que el cupo total.');
    }

    return await vacante.update(
        {
            cupoDisponible: nuevoCupoDisponible
        },
        {
            transaction: transaccion
        }
    );
};

module.exports = vacanteService;