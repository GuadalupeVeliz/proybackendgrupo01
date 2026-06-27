const express = require('express');
const empleadoRoutes = express.Router();
const empleadoController = require('../controllers/empleado.controller');

empleadoRoutes.get('/', empleadoController.getEmpleados);
empleadoRoutes.post('/', empleadoController.createEmpleado);
empleadoRoutes.get('/:id', empleadoController.getEmpleado);
empleadoRoutes.put('/:id', empleadoController.updateEmpleado);
empleadoRoutes.delete('/:id', empleadoController.deleteEmpleado);

module.exports = empleadoRoutes;
