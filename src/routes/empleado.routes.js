const express = require('express');
const empleadoController = require('../controllers/empleado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const empleadoRoutes = express.Router();

empleadoRoutes.use(authMiddleware.verifyUserToken);
empleadoRoutes.use(authMiddleware.authorizeByRole(['Gerente']));

empleadoRoutes.get('/', empleadoController.getEmpleados);
empleadoRoutes.post('/', empleadoController.createEmpleado);
empleadoRoutes.get('/:id', empleadoController.getEmpleado);
empleadoRoutes.put('/:id', empleadoController.updateEmpleado);
empleadoRoutes.delete('/:id', empleadoController.deleteEmpleado);

module.exports = empleadoRoutes;
