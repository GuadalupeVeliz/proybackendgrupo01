// src/routes/comprobante.route.js

const express = require('express');
const router = express.Router();

const comprobanteCtrl = require('../controllers/comprobante.controller');

// ==========================================
// RUTAS PERSONALIZADAS POR ROLES (Integrante D)
// ==========================================

// Vista para el Cliente logueado (Angular hará un GET aquí cuando el cliente entre a su perfil)
router.get('/mis-comprobantes', comprobanteCtrl.obtenerMisComprobantes);

// Vista filtrada para Gerente/Recepcionista (Angular enviará el ID del cliente al final de la URL)
router.get(
    '/cliente/:clienteId',
    comprobanteCtrl.obtenerComprobantesPorCliente
);

// Endpoint de descarga de PDF (Angular hará la petición aquí para bajar el archivo)
router.get('/:id/descargar', comprobanteCtrl.descargarComprobantePDF);

// Ruta para generar comprobante cuando se cancela una reserva
router.post('/cancelacion', comprobanteCtrl.generarComprobanteCancelacion);

// ==========================================
// RUTAS CRUD ESTÁNDAR
// ==========================================

router.get('/', comprobanteCtrl.getComprobantes);
router.get('/:id', comprobanteCtrl.getComprobante);
router.post('/', comprobanteCtrl.createComprobante);
router.put('/:id', comprobanteCtrl.updateComprobante);
router.delete('/:id', comprobanteCtrl.deleteComprobante);

module.exports = router;
