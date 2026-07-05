const express = require('express');
const pagoController = require('../controllers/pago.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const pagoRoutes = express.Router();

pagoRoutes.use(authMiddleware.verifyUserToken);
pagoRoutes.use(authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']));

pagoRoutes.get('/', pagoController.getPagos);
pagoRoutes.post('/', pagoController.createPago);
pagoRoutes.get('/:id', pagoController.getPagoById);
pagoRoutes.put('/:id', pagoController.updatePago);
pagoRoutes.delete('/:id', pagoController.deletePago);

module.exports = pagoRoutes;
