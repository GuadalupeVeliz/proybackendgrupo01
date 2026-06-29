const pagoService = require('../services/pago.service');
const pagoCtrl = {};

pagoCtrl.iniciarPago = async (req, res) => {
    try {
        const { reservaId, monedaOrigen } = req.body;
        const linkDePago = await pagoService.procesarInicioPago(reservaId, monedaOrigen);
        res.status(200).json({ linkDePago });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

pagoCtrl.confirmarPago = async (req, res) => {
    try {
        const { payment_id } = req.body;
        const resultado = await pagoService.procesarConfirmacionPago(payment_id);
        res.status(200).json({ 
            msg: 'Pago guardado, reserva confirmada y comprobante generado exitosamente',
            pago: resultado.pago,
            comprobante: resultado.comprobante
        });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

pagoCtrl.getPagos = async (req, res) => {
    try {
        const pagos = await pagoService.obtenerPagos();
        res.status(200).json(pagos);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

pagoCtrl.getPago = async (req, res) => {
    try {
        const pago = await pagoService.obtenerPagoPorId(req.params.id);
        res.status(200).json(pago);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

pagoCtrl.createPago = async (req, res) => {
    try {
        const nuevoPago = await pagoService.crearPagoManual(req.body);
        res.status(201).json({ msg: 'Pago creado exitosamente', pago: nuevoPago });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

pagoCtrl.updatePago = async (req, res) => {
    try {
        await pagoService.actualizarPago(req.params.id, req.body);
        res.status(200).json({ msg: 'Pago actualizado exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

pagoCtrl.deletePago = async (req, res) => {
    try {
        await pagoService.eliminarPago(req.params.id);
        res.status(200).json({ msg: 'Pago eliminado exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

module.exports = pagoCtrl;