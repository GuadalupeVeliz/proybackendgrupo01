const pagoService = require('../services/pago.service');

const pagoController = {};

pagoController.checkoutSession = async (req, res) => {
  try {
    const { reservaId } = req.body;
    const cotizacion = await pagoService.checkoutSession(reservaId);
    res.status(200).json(cotizacion);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

pagoController.webhook = async (req, res) => {
  try {
    const resultado = await pagoService.webhook(req.body);

    res.status(201).json({
      mensaje:
        'Pago guardado, reserva confirmada y comprobante generado exitosamente.',
      pago: resultado.pago,
      reservaEstado: resultado.reservaEstado,
      comprobante: resultado.comprobante,
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

pagoController.getPagos = async (req, res) => {
  try {
    const pagos = await pagoService.findPagos();
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

pagoController.createPago = async (req, res) => {
  try {
    const nuevoPago = await pagoService.addPagoManual(req.body);
    res
      .status(201)
      .json({ mensaje: 'Pago manual creado exitosamente', pago: nuevoPago });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

pagoController.getPago = async (req, res) => {
  try {
    const pago = await pagoService.findPago(req.params.id);
    res.status(200).json(pago);
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

pagoController.updatePago = async (req, res) => {
  try {
    await pagoService.editPago(req.params.id, req.body);
    res.status(200).json({ mensaje: 'Pago actualizado exitosamente' });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

pagoController.deletePago = async (req, res) => {
  try {
    await pagoService.deletePago(req.params.id);
    res.status(200).json({ mensaje: 'Pago eliminado exitosamente' });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

module.exports = pagoController;
