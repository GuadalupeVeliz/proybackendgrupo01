const sequelize = require('../../config/database.config');
const Cliente = require('../models/cliente.model');
const Reserva = require('../models/reserva.model');
const Vacante = require('../models/vacante.model');
const vacanteService = require('./vacante.service');

const reservaService = {};

reservaService.agregarReserva = async (data) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const transaccion = await sequelize.transaction();
    try {
        if (!data.fechaReservacion || !data.clienteId || !data.vacanteId || !data.cantidadPersonas) {
            throw new Error('Los campos de Fecha de Reservacion, cantidadPersonas, clienteId y vacanteId se deben completar')
        }

        const cliente = await Cliente.findOne({
            where: {
                id: data.clienteId
            },
            transaction: transaccion
        });

        if (!cliente) {
            throw new Error('Cliente no registrado.');
        }

        const vacante = await vacanteService.findVacante(data.vacanteId);

        if (!vacante) {
            throw new Error('La vacante no existe');
        }

        const disponibilidad = await vacanteService.consultarDisponibilidad(data.vacanteId, data.cantidadPersonas)
        if (!disponibilidad.disponible) {
            throw new Error(`No quedan cupos disponibles (${disponibilidad.cupoDisponible})`);
        }

        const fecha = new Date(data.fechaReservacion);
        fecha.setHours(0, 0, 0, 0);
        if (fecha < hoy) {
            throw new Error('La fecha de Reservacion no puede ser anterior a hoy')
        }

        const reserva = await Reserva.create(data, { transaction: transaccion });
        await vacanteService.descontarCupo(data.vacanteId, data.cantidadPersonas, transaccion);
        await transaccion.commit();
        return reserva;
    } catch (error) {
        await transaccion.rollback();
        throw error;
    }
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

    const transaccion = await sequelize.transaction();

    try {
        const reserva = await Reserva.findByPk(reservaId, { transaction: transaccion });

        if (!reserva) {
            throw new Error('Reserva no existe');
        }

        if (data.clienteId) {
            const cliente = await Cliente.findByPk(data.clienteId, { transaction: transaccion });
            if (!cliente) {
                throw new Error('Cliente no registrado');
            }
        }

        if (data.vacanteId) {
            const vacante = await vacanteService.findVacante(data.vacanteId, transaccion)
            if (!vacante) {
                throw new Error('Vacante no existe')
            }
            if (vacante.cupoDisponible <= 0) {
                throw new Error('Vacante sin cupos disponibles');
            }
        }

        if (data.fechaReservacion) {
            const fecha = new Date(data.fechaReservacion);
            fecha.setHours(0, 0, 0, 0);
            if (fecha < hoy) {
                throw new Error('La fecha de Reservacion no puede ser anterior a hoy')
            }
        }

        const nuevaVacanteId = data.vacanteId ?? reserva.vacanteId;
        const nuevaCantidad = data.cantidadPersonas ?? reserva.cantidadPersonas;

        if (data.cantidadPersonas != null || data.vacanteId != null) {

            await vacanteService.restaurarCupo(reserva.vacanteId, reserva.cantidadPersonas, transaccion);

            const disponibilidad = await vacanteService.consultarDisponibilidad(nuevaVacanteId, nuevaCantidad, transaccion);
            if (!disponibilidad.disponible) {
                throw new Error('No hay suficientes cupos para la reserva')
            }

            await vacanteService.descontarCupo(nuevaVacanteId, nuevaCantidad, transaccion);

        }

        await reserva.update(data, {
            transaction: transaccion
        })

        await transaccion.commit();

        return reserva;


    } catch (error) {
        await transaccion.rollback();
        throw error;
    }
}

reservaService.eliminarReserva = async (reservaId) => {

    const transaccion = await sequelize.transaction();
    try {

        const reserva = await Reserva.findByPk(reservaId, { transaction: transaccion });

        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }

        if (reserva.borrado) {
            throw new Error("La reserva ya fue eliminada");
        }

        if (reserva.estado == 'confirmada' || reserva.estado == 'pendiente') {
            await vacanteService.restaurarCupo(reserva.vacanteId, reserva.cantidadPersonas, transaccion);
        }
        await reserva.update(
            {
                borrado: true,
                estado: 'cancelada'
            },
            {
                transaction: transaccion
            });


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

        if (reserva.estado == 'confirmada' || reserva.estado == 'pendiente') {
            await vacanteService.restaurarCupo(reserva.vacanteId, reserva.cantidadPersonas, transaccion);
        }

        await reserva.update(
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

        if (reserva.estado === 'confirmada') {
            throw new Error('La reserva ya está confirmada');
        }

        await reserva.update(
            {
                estado: 'confirmada',
                montoPagado: data.montoPagado
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

module.exports = reservaService;