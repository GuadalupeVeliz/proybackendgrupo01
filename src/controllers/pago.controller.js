const pagoService = require('../services/pago.service');
const mercardoPagoService = require('../services/mercado-pago.service');

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

pagoController.webhook = async (req, res) => {
  console.log('Webhook recibido:', JSON.stringify(req.body));
  res.sendStatus(200);
  try {
    const { type, data } = req.body;
    if (type === 'payment' && data?.id) {
      await pagoService.procesarWebhook(data.id);
    }
  } catch (error) {
    console.error('Error en webhook Mercado Pago:', error);
  }
};

module.exports = pagoController;
