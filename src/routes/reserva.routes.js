const express = require('express');
const reservaCtrl = require('../controllers/reserva.controller');
const reservaRoutes = express.Router();

reservaRoutes.get('/', reservaCtrl.getReservas);
reservaRoutes.get('/:clienteId', reservaCtrl.getReservasPorCliente);
reservaRoutes.post('/', reservaCtrl.createReserva);
reservaRoutes.put('/:id', reservaCtrl.updateReserva);
reservaRoutes.put('/confirmar/:id', reservaCtrl.confirmarReserva);
reservaRoutes.put('/cancelar/:id', reservaCtrl.cancelarReserva);
reservaRoutes.delete('/:id', reservaCtrl.deleteReserva);

module.exports = reservaRoutes;
