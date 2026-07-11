const pagoService = require('../services/pago.service');
const mercardoPagoService = require('../services/mercado-pago.service');

const pagoController = {};

pagoController.getPagos = async (req, res) => {
  try {
    const pagos = await pagoService.findPagos();
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Pago',
          resultado: 'OK',
        })
    res.status(200).json({ success: true, data: pagos });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Pago',
          resultado: 'Error',
          detalleError:error.message
        })
    res.status(500).json({ success: false, error: error.message });
  }
};

pagoController.createPago = async (req, res) => {
  try {
    const pago = await pagoService.addPago(req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Pago',
          resultado: 'OK',
          entidadId: pago.id,
        })
    res.status(201).json({ success: true, data: pago });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Pago',
          resultado: 'Error',
          detalleError:error.message
        })
    res.status(400).json({ success: false, error: error.message });
  }
};

pagoController.getPagoById = async (req, res) => {
  try {
    const pago = await pagoService.findPagoById(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Pago',
          resultado: 'OK',
          entidadId: req.params.id,
        })
    res.status(200).json({ success: true, data: pago });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Pago',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        })
    res.status(404).json({ success: false, error: error.message });
  }
};

pagoController.updatePago = async (req, res) => {
  try {
    const pago = await pagoService.editPago(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Pago',
          resultado: 'OK',
          entidadId: req.params.id,
        })
    res.status(200).json({ success: true, data: pago });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Pago',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        })
    res.status(400).json({ success: false, error: error.message });
  }
};

pagoController.deletePago = async (req, res) => {
  try {
    await pagoService.deletePago(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Pago',
          resultado: 'OK',
          entidadId: req.params.id,
        })
    res.status(200).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Pago',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        })
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
