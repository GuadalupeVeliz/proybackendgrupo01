const comprobanteService = require('../services/comprobante.service');
const PDFDocument = require('pdfkit'); 

const comprobanteCtrl = {};

// ==========================================
// RUTAS PERSONALIZADAS POR ROLES 
// ==========================================

comprobanteCtrl.obtenerMisComprobantes = async (req, res) => {
    try {
        const miClienteId = req.usuario.clienteId;
        const comprobantes = await comprobanteService.obtenerComprobantesPorClienteId(miClienteId);
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || 'Error al obtener tu historial' });
    }
};

comprobanteCtrl.obtenerComprobantesPorCliente = async (req, res) => {
    try {
        const { clienteId } = req.params;
        // ¡Reutilizamos el mismo método del servicio!
        const comprobantes = await comprobanteService.obtenerComprobantesPorClienteId(clienteId);
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || 'Error al obtener los comprobantes' });
    }
};

comprobanteCtrl.generarComprobanteCancelacion = async (req, res) => {
    try {
        const { reservaId } = req.body;
        const comprobante = await comprobanteService.procesarCancelacion(reservaId);
        res.status(201).json({ msg: 'Cancelación procesada y comprobante generado', comprobante });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || 'Error al procesar la cancelación' });
    }
};

comprobanteCtrl.descargarComprobantePDF = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Pedimos los datos puros al servicio
        const comprobante = await comprobanteService.obtenerDatosComprobanteParaPDF(id);

        // 2. Configuramos la respuesta HTTP (Presentación)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=comprobante_${comprobante.numero}.pdf`);

        // 3. Dibujamos el PDF
        const doc = new PDFDocument();
        doc.pipe(res); 

        doc.fontSize(20).text('Turismo del Norte - Comprobante', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Número de Comprobante: ${comprobante.numero}`);
        doc.text(`Fecha de Emisión: ${comprobante.fechaEmision.toLocaleDateString()}`);
        doc.text(`Tipo: ${comprobante.tipo.toUpperCase()}`);
        doc.moveDown();
        doc.text(`Cliente: ${comprobante.reserva.cliente.nombreCompleto}`);
        doc.text(`DNI: ${comprobante.reserva.cliente.dni}`);
        doc.moveDown();
        
        // El alias 'paquete' ya está corregido aquí
        doc.text(`Paquete: ${comprobante.reserva.vacante.paquete.nombre}`);
        doc.text(`Estado de Reserva: ${comprobante.reserva.estado}`);
        
        doc.end(); 

    } catch (error) {
        console.error("Error al generar PDF:", error);
        if (!res.headersSent) {
            res.status(error.status || 500).json({ msg: error.message || 'Error al generar el documento PDF' });
        }
    }
};

// ==========================================
// RUTAS CRUD ESTÁNDAR
// ==========================================

comprobanteCtrl.getComprobantes = async (req, res) => {
    try {
        const comprobantes = await comprobanteService.obtenerTodos();
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

comprobanteCtrl.getComprobante = async (req, res) => {
    try {
        const comprobante = await comprobanteService.obtenerPorId(req.params.id);
        res.status(200).json(comprobante);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

comprobanteCtrl.createComprobante = async (req, res) => {
    try {
        const nuevoComprobante = await comprobanteService.crear(req.body);
        res.status(201).json(nuevoComprobante);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

comprobanteCtrl.updateComprobante = async (req, res) => {
    try {
        await comprobanteService.actualizar(req.params.id, req.body);
        res.status(200).json({ msg: 'Comprobante actualizado exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

comprobanteCtrl.deleteComprobante = async (req, res) => {
    try {
        await comprobanteService.eliminar(req.params.id);
        res.status(200).json({ msg: 'Comprobante eliminado exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

module.exports = comprobanteCtrl;