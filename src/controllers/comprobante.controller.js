// src/controllers/comprobante.controller.js

const Comprobante = require('../models/comprobante.model');
const Reserva = require('../models/reserva.model');
const Cliente = require('../models/cliente.model');
const Vacante = require('../models/vacante.model');
const PaqueteTuristico = require('../models/paqueteTuristico.model');
const PDFDocument = require('pdfkit'); // Librería para armar el PDF
const comprobanteCtrl = {};

// ==========================================
// RUTAS PERSONALIZADAS POR ROLES (Integrante D)
// ==========================================

// Para el Cliente: Solo ve sus propios comprobantes
comprobanteCtrl.obtenerMisComprobantes = async (req, res) => {
    try {
        // req.usuario.clienteId viene del middleware de JWT del Integrante A
        const miClienteId = req.usuario.clienteId; 

        const misComprobantes = await Comprobante.findAll({
            include: [{
                model: Reserva,
                as: 'reserva',
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente',
                        where: { id: miClienteId } // Filtro estricto de seguridad
                    },
                    { 
                        model: Vacante, 
                        as: 'vacante',
                        include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }]
                    }
                ]
            }]
        });

        res.status(200).json(misComprobantes);
    } catch (error) {
        console.error("Error al obtener mis comprobantes:", error);
        res.status(500).json({ msg: 'Error al obtener tu historial de comprobantes' });
    }
};

// Para Gerente/Recepcionista: Filtran por cualquier cliente
comprobanteCtrl.obtenerComprobantesPorCliente = async (req, res) => {
    try {
        const { clienteId } = req.params; 

        const comprobantes = await Comprobante.findAll({
            include: [{
                model: Reserva,
                as: 'reserva',
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente',
                        where: { id: clienteId } // Filtro dinámico según la URL
                    },
                    { 
                        model: Vacante, 
                        as: 'vacante',
                        include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }]
                    }
                ]
            }]
        });

        res.status(200).json(comprobantes);
    } catch (error) {
        console.error("Error al filtrar comprobantes:", error);
        res.status(500).json({ msg: 'Error al obtener los comprobantes del cliente' });
    }
};

// Endpoint de descarga de PDF
comprobanteCtrl.descargarComprobantePDF = async (req, res) => {
    try {
        const { id } = req.params;
        const comprobante = await Comprobante.findByPk(id, {
            include: [{
                model: Reserva,
                as: 'reserva',
                include: [
                    { model: Cliente, as: 'cliente' },
                    { model: Vacante, as: 'vacante', include: [{ model: PaqueteTuristico, as: 'paqueteTuristico' }] }
                ]
            }]
        });

        if (!comprobante) {
            return res.status(404).json({ msg: 'Comprobante no encontrado' });
        }

        // Configuramos la respuesta HTTP para que el navegador sepa que es un archivo PDF descargable
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=comprobante_${comprobante.numero}.pdf`);

        // Armamos el PDF
        const doc = new PDFDocument();
        doc.pipe(res); // Conectamos el documento directamente a la respuesta HTTP

        // Diseño básico del PDF
        doc.fontSize(20).text('Turismo del Norte - Comprobante', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Número de Comprobante: ${comprobante.numero}`);
        doc.text(`Fecha de Emisión: ${comprobante.fechaEmision.toLocaleDateString()}`);
        doc.text(`Tipo: ${comprobante.tipo.toUpperCase()}`);
        doc.moveDown();
        doc.text(`Cliente: ${comprobante.reserva.cliente.nombreCompleto}`);
        doc.text(`DNI: ${comprobante.reserva.cliente.dni}`);
        doc.moveDown();
        doc.text(`Paquete: ${comprobante.reserva.vacante.paqueteTuristico.nombre}`);
        doc.text(`Estado de Reserva: ${comprobante.reserva.estado}`);
        
        doc.end(); // Finalizamos y enviamos el archivo

    } catch (error) {
        console.error("Error al generar PDF:", error);
        res.status(500).json({ msg: 'Error al generar el documento PDF' });
    }
};

// Generación de comprobante por Cancelación (Para que lo consuma el Integrante C)
comprobanteCtrl.generarComprobanteCancelacion = async (req, res) => {
    try {
        const { reservaId } = req.body;
        
        // Creamos el comprobante tipo 'cancelacion'
        const comprobante = await Comprobante.create({
            numero: `CAN-${Date.now()}`,
            fechaEmision: new Date(),
            tipo: 'cancelacion',
            reservaId: reservaId
        });
        
        res.status(201).json({ 
            msg: 'Comprobante de cancelación generado exitosamente', 
            comprobante 
        });
    } catch (error) {
        console.error("Error al generar comprobante de cancelación:", error);
        res.status(500).json({ msg: 'Error al generar comprobante de cancelación' });
    }
};

// ==========================================
// RUTAS CRUD ESTÁNDAR
// ==========================================

comprobanteCtrl.getComprobantes = async (req, res) => {
    try {
        const comprobantes = await Comprobante.findAll({
            include: [{ model: Reserva, as: 'reserva' }]
        });
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener comprobantes' });
    }
};

comprobanteCtrl.getComprobante = async (req, res) => {
    try {
        const { id } = req.params;
        const comprobante = await Comprobante.findByPk(id, {
            include: [{ model: Reserva, as: 'reserva' }]
        });
        if (!comprobante) return res.status(404).json({ msg: 'Comprobante no encontrado' });
        res.status(200).json(comprobante);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el comprobante' });
    }
};

comprobanteCtrl.createComprobante = async (req, res) => {
    try {
        const nuevoComprobante = await Comprobante.create(req.body);
        res.status(201).json(nuevoComprobante);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear comprobante' });
    }
};

comprobanteCtrl.updateComprobante = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Comprobante.update(req.body, { where: { id } });
        res.status(200).json(actualizado);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar comprobante' });
    }
};

comprobanteCtrl.deleteComprobante = async (req, res) => {
    try {
        const { id } = req.params;
        await Comprobante.destroy({ where: { id } });
        res.status(200).json({ msg: 'Comprobante eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar comprobante' });
    }
};

module.exports = comprobanteCtrl;