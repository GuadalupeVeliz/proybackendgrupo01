const Vacante = require('../models/vacante.model');
const PaqueteTuristico = require('../models/paqueteTuristico.model');

const vacanteService = {};

const SUCURSALES_VALIDAS = [
    'SAN_SALVADOR',
    'PURMAMARCA',
    'TILCARA'
];

const crearError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const validarSucursal = (sucursal) => {
    if (!SUCURSALES_VALIDAS.includes(sucursal)) {
        throw crearError(
            'La sucursal debe ser SAN_SALVADOR, PURMAMARCA o TILCARA.',
            400
        );
    }
};

const validarFechaFutura = (fechaSalida) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fecha = new Date(fechaSalida);

    if (fecha <= hoy) {
        throw crearError(
            'La fecha de salida debe ser posterior a la fecha actual.',
            400
        );
    }
};

vacanteService.findVacantes = async () => {
    return await Vacante.findAll({
        include: {
            model: PaqueteTuristico,
            as: 'paquete'
        },
        order: [['fechaSalida', 'ASC']]
    });
};

vacanteService.findVacante = async (vacanteId) => {
    const vacante = await Vacante.findByPk(vacanteId, {
        include: {
            model: PaqueteTuristico,
            as: 'paquete'
        }
    });

    if (!vacante) {
        throw crearError('Vacante no encontrada.', 404);
    }

    return vacante;
};

vacanteService.addVacante = async (data) => {
    const { paqueteId, fechaSalida, sucursal, cupoTotal } = data;

    if (
        paqueteId == null ||
        !fechaSalida ||
        !sucursal ||
        cupoTotal == null
    ) {
        throw crearError('Todos los campos son obligatorios.', 400);
    }

    if (cupoTotal <= 0) {
        throw crearError('El cupo total debe ser mayor a cero.', 400);
    }

    validarSucursal(sucursal);
    validarFechaFutura(fechaSalida);

    const paquete = await PaqueteTuristico.findByPk(paqueteId);

    if (!paquete) {
        throw crearError('El paquete turístico no existe.', 404);
    }

    if (paquete.estado !== 'activo') {
        throw crearError(
            'No se pueden crear vacantes para un paquete inactivo.',
            409
        );
    }

    const vacanteExistente = await Vacante.findOne({
        where: {
            paqueteId,
            fechaSalida,
            sucursal
        }
    });

    if (vacanteExistente) {
        throw crearError(
            'Ya existe una vacante para ese paquete, fecha y sucursal.',
            409
        );
    }

    return await Vacante.create({
        paqueteId,
        fechaSalida,
        sucursal,
        cupoTotal,
        cupoDisponible: cupoTotal
    });
};

vacanteService.editVacante = async (vacanteId, data) => {
    const { fechaSalida, sucursal, cupoTotal } = data;

    const vacante = await Vacante.findByPk(vacanteId);

    if (!vacante) {
        throw crearError('Vacante no encontrada.', 404);
    }

    if (!fechaSalida || !sucursal || cupoTotal == null) {
        throw crearError('Todos los campos son obligatorios.', 400);
    }

    if (cupoTotal <= 0) {
        throw crearError('El cupo total debe ser mayor a cero.', 400);
    }

    validarSucursal(sucursal);
    validarFechaFutura(fechaSalida);

    const vacanteExistente = await Vacante.findOne({
        where: {
            paqueteId: vacante.paqueteId,
            fechaSalida,
            sucursal
        }
    });

    if (vacanteExistente && vacanteExistente.id !== vacante.id) {
        throw crearError(
            'Ya existe una vacante para ese paquete, fecha y sucursal.',
            409
        );
    }

    const reservados = vacante.cupoTotal - vacante.cupoDisponible;

    if (cupoTotal < reservados) {
        throw crearError(
            'No es posible reducir el cupo porque existen reservas asociadas.',
            409
        );
    }

    const nuevoCupoDisponible = cupoTotal - reservados;

    return await vacante.update({
        fechaSalida,
        sucursal,
        cupoTotal,
        cupoDisponible: nuevoCupoDisponible
    });
};

vacanteService.deleteVacante = async (vacanteId) => {
    const vacante = await Vacante.findByPk(vacanteId);

    if (!vacante) {
        throw crearError('Vacante no encontrada.', 404);
    }

    if (vacante.cupoTotal !== vacante.cupoDisponible) {
        throw crearError(
            'No se puede eliminar la vacante porque ya tiene cupos reservados.',
            409
        );
    }

    return await vacante.destroy();
};

vacanteService.consultarDisponibilidad = async (vacanteId, cantidad, transaccion = null) => {
    const vacante = await Vacante.findByPk(vacanteId, {
        transaction: transaccion
    });

    if (!vacante) {
        throw crearError('Vacante no encontrada.', 404);
    }

    if (!cantidad || cantidad <= 0) {
        throw crearError('La cantidad de personas debe ser mayor a cero.', 400);
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
        throw crearError('Vacante no encontrada.', 404);
    }

    if (!cantidad || cantidad <= 0) {
        throw crearError('La cantidad de personas debe ser mayor a cero.', 400);
    }

    if (vacante.cupoDisponible < cantidad) {
        throw crearError('No hay cupos suficientes disponibles.', 409);
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
        throw crearError('Vacante no encontrada.', 404);
    }

    if (!cantidad || cantidad <= 0) {
        throw crearError('La cantidad de personas debe ser mayor a cero.', 400);
    }

    const nuevoCupoDisponible = vacante.cupoDisponible + cantidad;

    if (nuevoCupoDisponible > vacante.cupoTotal) {
        throw crearError(
            'No se puede restaurar más cupo que el cupo total.',
            409
        );
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