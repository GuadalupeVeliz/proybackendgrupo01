const comprobanteService = require('../services/comprobante.service');
const pdfService = require('../services/pdf.service');

const comprobanteController = {};

// TODO: Revisar si estos 4 métodos son necesarios y funcionan correctamente.
comprobanteController.getMyComprobantes = async (req, res) => {
  try {
    const clienteId = req.usuarioLogged.cliente.id;
    const comprobantes = await comprobanteService.findComprobantesByCliente(clienteId);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

comprobanteController.getComprobantesByClienteId = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const comprobantes = await comprobanteService.findComprobantesByClienteId(clienteId);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

comprobanteController.processCancelacion = async (req, res) => {
  try {
    const { reservaId } = req.body;
    const comprobante = await comprobanteService.processCancelacion(reservaId);
    return res.status(201).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
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
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

comprobanteController.getComprobantes = async (req, res) => {
  try {
    const comprobantes = await comprobanteService.findComprobantes();
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

comprobanteController.getComprobanteById = async (req, res) => {
  try {
    const comprobante = await comprobanteService.findComprobanteById(req.params.id);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

comprobanteController.createComprobante = async (req, res) => {
  try {
    const nuevoComprobante = await comprobanteService.addComprobante(req.body);
    return res.status(201).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

comprobanteController.updateComprobante = async (req, res) => {
  try {
    await comprobanteService.editComprobante(req.params.id, req.body);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

comprobanteController.deleteComprobante = async (req, res) => {
  try {
    await comprobanteService.deleteComprobante(req.params.id);
    return res.status(200).json({ success: true, data: vacante });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = comprobanteController;
