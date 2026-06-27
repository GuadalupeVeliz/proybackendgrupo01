const Vacante = require('../models/vacante.model');
const PaqueteTuristico = require('../models/paqueteTuristico.model');

const vacanteCtrl = {};

const SUCURSALES_VALIDAS = [
    'SAN_SALVADOR',
    'PURMAMARCA',
    'TILCARA'
];

vacanteCtrl.getVacantes = async (req, res) => {
    try {
        const vacantes = await Vacante.findAll({
            include: {
                model: PaqueteTuristico,
                as: 'paquete'
            },
            order: [['fechaSalida', 'ASC']]
        });

        res.json(vacantes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al obtener las vacantes.'
        });
    }
};

vacanteCtrl.getVacante = async (req, res) => {
    try {

        const vacante = await Vacante.findByPk(req.params.id, {
            include: {
                model: PaqueteTuristico,
                as: 'paquete'
            }
        });

        if (!vacante) {
            return res.status(404).json({
                message: 'Vacante no encontrada.'
            });
        }

        res.json(vacante);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener la vacante.'
        });
    }
};

vacanteCtrl.createVacante = async (req, res) => {
    try {

        const {
            paqueteId,
            fechaSalida,
            sucursal,
            cupoTotal
        } = req.body;

        // Validar datos obligatorios
        if (
            paqueteId == null ||
            !fechaSalida ||
            !sucursal ||
            cupoTotal == null
        ) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios.'
            });
        }

        // Validar cupo
        if (cupoTotal <= 0) {
            return res.status(400).json({
                message: 'El cupo total debe ser mayor a cero.'
            });
        }

        // Buscar paquete
        const paquete = await PaqueteTuristico.findByPk(paqueteId);

        if (!paquete) {
            return res.status(404).json({
                message: 'El paquete turístico no existe.'
            });
        }

        // Validar estado del paquete
        if (paquete.estado !== 'activo') {
            return res.status(409).json({
                message: 'No se pueden crear vacantes para un paquete inactivo.'
            });
        }

        // Validar sucursal
        if (!SUCURSALES_VALIDAS.includes(sucursal)) {
            return res.status(400).json({
                message: 'La sucursal debe ser SAN_SALVADOR, PURMAMARCA o TILCARA.'
            });
        }

        // Validar que la fecha sea futura
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const fecha = new Date(fechaSalida);

        if (fecha <= hoy) {
            return res.status(400).json({
                message: 'La fecha de salida debe ser posterior a la fecha actual.'
            });
        }

        // Verificar que no exista otra vacante igual
        const vacanteExistente = await Vacante.findOne({
            where: {
                paqueteId,
                fechaSalida,
                sucursal
            }
        });

        if (vacanteExistente) {
            return res.status(409).json({
                message: 'Ya existe una vacante para ese paquete, fecha y sucursal.'
            });
        }

        // Crear vacante
        const nuevaVacante = await Vacante.create({
            paqueteId,
            fechaSalida,
            sucursal,
            cupoTotal,
            cupoDisponible: cupoTotal
        });

        res.status(201).json(nuevaVacante);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al crear la vacante.'
        });
    }
};

// Actualizar una vacante
vacanteCtrl.updateVacante = async (req, res) => {
    try {

        const { fechaSalida, sucursal, cupoTotal } = req.body;

        // Buscar la vacante
        const vacante = await Vacante.findByPk(req.params.id);

        if (!vacante) {
            return res.status(404).json({
                message: 'Vacante no encontrada.'
            });
        }

        // Validar datos obligatorios
        if (!fechaSalida || !sucursal || cupoTotal == null) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios.'
            });
        }

        // Validar cupo
        if (cupoTotal <= 0) {
            return res.status(400).json({
                message: 'El cupo total debe ser mayor a cero.'
            });
        }

        // Validar sucursal
        if (!SUCURSALES_VALIDAS.includes(sucursal)) {
            return res.status(400).json({
                message: 'La sucursal debe ser SAN_SALVADOR, PURMAMARCA o TILCARA.'
            });
        }

        // Validar fecha
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const fecha = new Date(fechaSalida);

        if (fecha <= hoy) {
            return res.status(400).json({
                message: 'La fecha de salida debe ser posterior a la fecha actual.'
            });
        }

        // Verificar duplicados
        const vacanteExistente = await Vacante.findOne({
            where: {
                paqueteId: vacante.paqueteId,
                fechaSalida,
                sucursal
            }
        });

        if (
            vacanteExistente &&
            vacanteExistente.id !== vacante.id
        ) {
            return res.status(409).json({
                message: 'Ya existe una vacante para ese paquete, fecha y sucursal.'
            });
        }

        // Si aumenta o disminuye el cupo, mantener la cantidad de reservas
        const reservados =
            vacante.cupoTotal - vacante.cupoDisponible;

        if (cupoTotal < reservados) {
            return res.status(409).json({
                message: 'No es posible reducir el cupo porque existen reservas asociadas.'
            });
        }

        const nuevoCupoDisponible = cupoTotal - reservados;

        await vacante.update({
            fechaSalida,
            sucursal,
            cupoTotal,
            cupoDisponible: nuevoCupoDisponible
        });

        res.json(vacante);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al actualizar la vacante.'
        });
    }
};

// Eliminar una vacante
vacanteCtrl.deleteVacante = async (req, res) => {
    try {
        const vacante = await Vacante.findByPk(req.params.id);

        if (!vacante) {
            return res.status(404).json({
                message: 'Vacante no encontrada.'
            });
        }

        if (vacante.cupoTotal !== vacante.cupoDisponible) {
            return res.status(409).json({
                message: 'No se puede eliminar la vacante porque ya tiene cupos reservados.'
            });
        }

        await vacante.destroy();

        res.json({
            message: 'Vacante eliminada correctamente.'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al eliminar la vacante.'
        });
    }
};

module.exports = vacanteCtrl;