const pagoService = require('../services/pago.service');

const pagoController = {};

pagoController.getPagos = async (req, res) => {
  try {
    const pagos = await pagoService.findPagos();
    res.status(200).json({ success: true, data: pagos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

pagoController.createPago = async (req, res) => {
  try {
    const pago = await pagoService.addPago(req.body);
    res.status(201).json({ success: true, data: pago });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

pagoController.getPagoById = async (req, res) => {
  try {
    const pago = await pagoService.findPagoById(req.params.id);
    res.status(200).json({ success: true, data: pago });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

pagoController.updatePago = async (req, res) => {
  try {
    const pago = await pagoService.editPago(req.params.id, req.body);
    res.status(200).json({ success: true, data: pago });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

pagoController.deletePago = async (req, res) => {
  try {
    await pagoService.deletePago(req.params.id);
    res.status(200).send();
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = pagoController;
