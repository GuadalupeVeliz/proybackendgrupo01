const auditoriaService = require('../services/auditoria.service');
const comprobanteService = require('../services/comprobante.service');
const pdfService = require('../services/pdf.service');

const comprobanteController = {};

comprobanteController.getMyComprobantes = async (req, res) => {
  try {
    const clienteId = req.usuarioLogged.cliente.id;
    const comprobantes = await comprobanteService.findComprobanteById(clienteId);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: comprobantes });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

comprobanteController.getComprobantesByClienteId = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const comprobantes = await comprobanteService.findComprobanteById(clienteId);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: comprobantes });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

comprobanteController.downloadComprobantePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const comprobante = await comprobanteService.findComprobanteData(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=comprobante_${comprobante.numero}.pdf`,
    );
    await auditoriaService.registrarCreate(req,{
          accion: 'Descargar', 
          modelo: 'Comprobante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return pdfService.buildComprobantePDF(comprobante, res);
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Descargar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

comprobanteController.getComprobantes = async (req, res) => {
  try {
    const comprobantes = await comprobanteService.findComprobantes();
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: comprobantes });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

comprobanteController.getComprobanteById = async (req, res) => {
  try {
    const comprobante = await comprobanteService.findComprobanteById(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: comprobante });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

comprobanteController.createComprobante = async (req, res) => {
  try {
    const comprobante = await comprobanteService.addComprobante(req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Comprobante',
          resultado: 'OK',
          entidadId: comprobante.id,
        });
    return res.status(201).json({ success: true, data: comprobante });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Comprobante',
          resultado: 'OK',
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

comprobanteController.updateComprobante = async (req, res) => {
  try {
    const comprobante = await comprobanteService.editComprobante(req.params.id, req.body);
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Comprobante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: comprobante });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

comprobanteController.deleteComprobante = async (req, res) => {
  try {
    await comprobanteService.deleteComprobante(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Comprobante',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Comprobante',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = comprobanteController;
