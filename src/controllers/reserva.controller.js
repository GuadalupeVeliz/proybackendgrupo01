const Cliente = require('../models/cliente.model');
const Reserva = require('../models/reserva.model');
const reservaService = require('../services/reserva.service');

const reservaCtrl = {};

reservaCtrl.createReserva = async (req, res) => {
    try {
        const reserva = await reservaService.agregarReserva(req.body);
        res.status(201).json(reserva);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al crear Reserva',
            error: error.message
        });
    }
}

reservaCtrl.getReservas = async (req, res) => {
    try {
        const reservas = await reservaService.traerReservas()
        res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: error.message
        });
    }
}

reservaCtrl.updateReserva = async (req, res) => {
    try {
        const empleado = await reservaService.modificarReservas(req.params.id, req.body)
        res.status(200).json({
            msg: 'Reserva actualizada'
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al actualizar Reserva',
            error: error.message
        });
    }
}

reservaCtrl.deleteReserva = async (req, res) => {
    try {
        const reserva = await reservaService.eliminarReserva(req.params.id);
        res.status(200).json({
            msg: 'Reserva eliminada'
        })
    } catch (error) {
        res.status(404).json({
            msg: error.message
        })
    }
}

reservaCtrl.cancelarReserva = async (req, res) => {
    try {
        await reservaService.cancelarReserva(req.params.id);
        res.status(200).json({
            msg: 'Reserva Cancelada'
        })
    } catch (error) {
        res.status(500).json({
            msg: error.message
        })
    }
}

reservaCtrl.getReservasPorCliente = async (req, res) => {
    try {
        const reservas = await reservaService.traerReservasPorCliente(req.params.clienteId);
        res.status(200).json(reservas);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}

reservaCtrl.confirmarReserva = async (req, res) => {
    try {
        await reservaService.confirmarReserva(req.params.id,req.body);
        res.status(200).json({
            msg: 'Reserva confirmada'
        });
    } catch (error) {
        res.status(404).json({
            error: error.message
        });
    }
}

module.exports = reservaCtrl