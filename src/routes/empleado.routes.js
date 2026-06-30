const express = require('express');
const empleadoController = require('../controllers/empleado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const empleadoRoutes = express.Router();

empleadoRoutes.get('/', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), empleadoController.getEmpleados);
empleadoRoutes.post('/', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), empleadoController.createEmpleado);
empleadoRoutes.get('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), empleadoController.getEmpleado);
empleadoRoutes.put('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), empleadoController.updateEmpleado);
empleadoRoutes.delete('/:id', authMiddleware.verifyToken, authMiddleware.authorize(['Gerente']), empleadoController.deleteEmpleado);

module.exports = empleadoRoutes;
