const sequelize = require('../../config/database.config');
const Cliente = require('../models/cliente.model');
const Reserva = require('../models/reserva.model');
const Vacante = require('../models/vacante.model');

const reservaService = {};

reservaService.agregarReserva = async (data) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!data.fechaReservacion || !data.clienteId || !data.vacanteId) {
        throw new Error('Los campos de Fecha de Reservacion, clienteId y vacanteId se deben completar')
    }

    const cliente = await Cliente.findOne({
        where: {
            id: data.clienteId
        },
    });

    if (!cliente) {
        throw new Error('Cliente no registrado.');
    }

    const vacante = await Vacante.findOne({
        where: {
            id: data.vacanteId
        },
    })

    if (!vacante) {
        throw new Error('La vacante no existe');
    }

    if (vacante.cupoDisponible <= 0) {
        throw new Error('No quedan cupos disponibles');
    }

    if (data.fechaReservacion < hoy) {
        throw new Error('La fecha de Reservacion no puede ser anterior a hoy')
    }

    return await Reserva.create(data);
}

reservaService.traerReservas = async () => {
    return await Reserva.findAll({
        include: [{
            model: Cliente,
            as: 'cliente',
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
        {
            model: Vacante,
            as: 'vacante',
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }],
        where: {
            borrado: false
        },
        order: [['fechaCreacion', 'ASC']],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
};

reservaService.modificarReservas = async (reservaId, data) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reserva = await Reserva.findByPk(reservaId);

    if (!reserva) {
        throw new Error('Reserva no existe');
    }

    if (data.clienteId) {
        const cliente = await Cliente.findByPk(data.clienteId);
        if (!cliente) {
            throw new Error('Cliente no registrado');
        }
    }

    if (data.vacanteId) {
        const vacante = await Vacante.findByPk(data.vacanteId);
        if (!vacante) {
            throw new Error('Vacante no existe')
        }
        if (vacante.cupoDisponible <= 0) {
            throw new Error('Vacante sin cupos disponibles');
        }
    }

    if (data.fechaReservacion) {
        if (data.fechaReservacion < hoy) {
            throw new Error('La fecha de Reservacion no puede ser anterior a hoy')
        }
    }

    return await reserva.update(data)
}

reservaService.eliminarReserva = async (reservaId) => {

    const transaccion = await sequelize.transaction();
    try {

        const reserva = await Reserva.findByPk(reservaId, { transaction: transaccion });

        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }


        await reserva.update(
            {
                borrado: true,
                estado: 'cancelada'
            },
            {
                transaction: transaccion
            });

        //operacion de descuento de vacante desde vacanteService

        await transaccion.commit();
        return reserva;

    } catch (error) {
        await transaccion.rollback();
        throw error;
    }

}

reservaService.cancelarReserva = async (reservaId) => {

    const transaccion = await sequelize.transaction();
    try {
        const reserva = await Reserva.findByPk(reservaId, { transaction: transaccion });

        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }

        if (reserva.estado == 'confirmada') {
            //Operacion de descontar cupo de vacanteService :D
        }

        return await reserva.update(
            {
                estado: 'cancelada'
            },
            {
                transaction: transaccion
            });

        await transaccion.commit();
        return reserva;

    } catch (error) {
        await transaccion.rollback()
        throw error;

    }
}

reservaService.traerReservasPorCliente = async (clienteId) => {
    const reservas = await Reserva.findAll({
        where: {
            clienteId: clienteId,
            borrado: false
        },
        include: [{
            model: Cliente,
            as: 'cliente',
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
        {
            model: Vacante,
            as: 'vacante',
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    return reservas;
}

reservaService.confirmarReserva = async (reservaId, data) => {

    const transaccion = await sequelize.transaction();
    try {
        const reserva = await Reserva.findByPk(reservaId, { transaction: transaccion });

        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }
        if (!data.montoPagado) {
            throw new Error('Debe ingresar monto para confirmar');
        }
        if (data.montoPagado <= 0) {
            throw new Error('Monto ingresado no puede ser menor q 0');
        }

        await reserva.update(
            {
                estado: 'confirmada',
                montoPagado: data.montoPagado
            },
            {
                transaction: transaccion
            });

        //Operacion de ocupar un cupo de vacanteService :D
        await transaccion.commit();
        return reserva;

    } catch (error) {
        await transaccion.rollback()
        throw error;
    }
}

module.exports = reservaService;