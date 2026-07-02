const comprobanteService = require('../services/comprobante.service');
const pdfService = require('../services/pdf.service');

const comprobanteController = {};

comprobanteController.getMyComprobantes = async (req, res) => {
  try {
    const clienteId = req.usuarioLogged.cliente.id;
    const comprobantes =
      await comprobanteService.findComprobantesByCliente(clienteId);
    return res.status(200).json(comprobantes);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ mensaje: error.message || 'Error al obtener tu historial' });
  }
};

comprobanteController.getComprobantesByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const comprobantes =
      await comprobanteService.findComprobantesByCliente(clienteId);
    return res.status(200).json(comprobantes);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ mensaje: error.message || 'Error al obtener los comprobantes' });
  }
};

comprobanteController.processCancelacion = async (req, res) => {
  try {
    const { reservaId } = req.body;
    const comprobante = await comprobanteService.processCancelacion(reservaId);
    return res.status(201).json({
      mensaje: 'Cancelación procesada y comprobante generado',
      comprobante,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ mensaje: error.message });
  }
};

comprobanteController.downloadComprobantePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const comprobante = await comprobanteService.findComprobanteData(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=comprobante_${comprobante.numero}.pdf`
    );

    return pdfService.buildComprobantePDF(comprobante, res);
  } catch (error) {
    console.error('Error crítico al generar PDF:', error);
    if (!res.headersSent) {
      return res.status(error.status || 500).json({
        mensaje: error.message || 'Error al generar el documento PDF',
      });
    }
  }
};

comprobanteController.getComprobantes = async (req, res) => {
  try {
    const comprobantes = await comprobanteService.findComprobantes();
    return res.status(200).json(comprobantes);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

comprobanteController.getComprobante = async (req, res) => {
  try {
    const comprobante = await comprobanteService.findComprobante(req.params.id);
    return res.status(200).json(comprobante);
  } catch (error) {
    return res.status(error.status || 404).json({ mensaje: error.message });
  }
};

comprobanteController.createComprobante = async (req, res) => {
  try {
    const nuevoComprobante = await comprobanteService.addComprobante(req.body);
    return res.status(201).json(nuevoComprobante);
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
};

comprobanteController.updateComprobante = async (req, res) => {
  try {
    await comprobanteService.editComprobante(req.params.id, req.body);
    return res
      .status(200)
      .json({ mensaje: 'Comprobante actualizado exitosamente' });
  } catch (error) {
    return res.status(400).json({ mensaje: error.message });
  }
};

comprobanteController.deleteComprobante = async (req, res) => {
  try {
    await comprobanteService.deleteComprobante(req.params.id);
    return res
      .status(200)
      .json({ mensaje: 'Comprobante eliminado exitosamente' });
  } catch (error) {
    return res.status(error.status || 404).json({ mensaje: error.message });
  }
};

module.exports = comprobanteController;
