const express = require('express');
const router = express.Router();

const pagoCtrl = require('../controllers/pago.controller');

// ==========================================
// RUTAS DE INTEGRACIÓN CON MERCADO PAGO
// ==========================================

// Ruta para que Angular inicie el proceso (devuelve el link de Mercado Pago)
router.post('/iniciar', pagoCtrl.iniciarPago);

// Ruta para que Angular confirme el cobro una vez que el cliente vuelve
router.post('/confirmar', pagoCtrl.confirmarPago);

// ==========================================
// RUTAS CRUD ESTÁNDAR
// ==========================================

// Listar todos los pagos (incluyendo su reserva asociada)
router.get('/', pagoCtrl.getPagos);

// Ver el detalle de un pago específico
router.get('/:id', pagoCtrl.getPago);

// Rutas administrativas
router.post('/', pagoCtrl.createPago);
router.put('/:id', pagoCtrl.updatePago);
router.delete('/:id', pagoCtrl.deletePago);

module.exports = router;
