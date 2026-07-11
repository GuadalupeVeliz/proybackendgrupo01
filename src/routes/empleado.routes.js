const express = require('express');
const empleadoController = require('../controllers/empleado.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const empleadoRoutes = express.Router();

empleadoRoutes.use(authMiddleware.verifyUserToken);
empleadoRoutes.use(authMiddleware.authorizeByRole(['Gerente']));

empleadoRoutes.get('/',
  /**
    #swagger.tags = ['Empleados']
    #swagger.summary = 'Obtener lista de empleados'
    #swagger.description = 'Devuelve la lista los empleados activos'
    #swagger.responses[200] = {
      description: 'Lista de empleados obtenida correctamente'
    }
    #swagger.responses[500] = {
      description: 'Error al obtener los empleados'
    }
  */
  empleadoController.getEmpleados
);
empleadoRoutes.post('/',
  /**
    #swagger.tags = ['Empleados']
    #swagger.summary = 'Crear un nuevo empleado'
    #swagger.description = 'Registra un nuevo empleado, validando que el legajo no esté duplicado'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del empleado a crear',
      schema: { $ref: '#/definitions/createEmpleado' }
    }
    #swagger.responses[201] = {
      description: 'Empleado creado correctamente'
    }
    #swagger.responses[400] = {
      description: 'Error al crear el empleado (ej. legajo duplicado)'
    }
    #swagger.responses[401] = {
      description: 'Acceso denegado. Token no proporcionado'
    }
    #swagger.responses[403] = {
      description: 'Acceso denegado'
    }
  */
  empleadoController.createEmpleado
);
empleadoRoutes.get('/:id',
  /**
    #swagger.tags = ['Empleados']
    #swagger.summary = 'Obtener un empleado por ID'
    #swagger.description = 'Devuelve los datos de un empleado activo según su ID'
    #swagger.parameters['id'] = { description: 'ID del empleado' }
    #swagger.responses[200] = {
      description: 'Empleado encontrado'
    }
    #swagger.responses[404] = {
      description: 'Empleado no encontrado o dado de baja'
    }
  */
  empleadoController.getEmpleadoById
);
empleadoRoutes.put('/:id',
  /**
   #swagger.tags = ['Empleados']
   #swagger.summary = 'Actualizar un empleado'
   #swagger.description = 'Modifica los datos de un empleado activo, validando legajo duplicado si se cambia'
   #swagger.parameters['id'] = { description: 'ID del empleado' }
   #swagger.parameters['body'] = {
     in: 'body',
     description: 'Datos a actualizar',
     schema: { $ref: '#/definitions/updateEmpleado' }
   }
   #swagger.responses[200] = {
     description: 'Empleado actualizado correctamente'
   }
   #swagger.responses[404] = {
     description: 'Empleado no encontrado o legajo duplicado'
   }
 */
  empleadoController.updateEmpleado
);
empleadoRoutes.delete('/:id',
  /**
   #swagger.tags = ['Empleados']
   #swagger.summary = 'Eliminar (dar de baja) un empleado'
   #swagger.description = 'Marca al empleado como inactivo (soft delete)'
   #swagger.parameters['id'] = { description: 'ID del empleado' }
   #swagger.responses[204] = {
     description: 'Empleado eliminado correctamente'
   }
   #swagger.responses[404] = {
     description: 'Empleado no encontrado o ya eliminado',
   }
 */
  empleadoController.deleteEmpleado
);

module.exports = empleadoRoutes;
