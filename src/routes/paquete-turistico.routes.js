const express = require('express');
const paqueteTuristicoController = require('../controllers/paquete-turistico.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const paqueteTuristicoRoutes = express.Router();

paqueteTuristicoRoutes.get(
  '/',
  /*
    #swagger.tags = ['Paquetes Turísticos']
    #swagger.summary = 'Obtener listado de paquetes turísticos'
    #swagger.description = 'Devuelve todos los paquetes turísticos activos, incluyendo sus vacantes asociadas'
    #swagger.responses[200] = {
      description: 'Listado obtenido correctamente',
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener los paquetes turísticos'
    }
  */
  paqueteTuristicoController.getPaquetesTuristicos,
);
paqueteTuristicoRoutes.post(
  '/',
    /*
    #swagger.tags = ['Paquetes Turísticos']
    #swagger.summary = 'Crear un nuevo paquete turístico'
    #swagger.description = 'Registra un paquete turístico nuevo, validando que el nombre no esté duplicado'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del paquete turístico a crear',
      schema: { $ref: '#/definitions/createPaqueteTuristico' }
    }
    #swagger.responses[201] = {
      description: 'Paquete creado correctamente',
    }
    #swagger.responses[400] = { 
      description: 'El nombre ya está registrado'
    }
  */
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.createPaqueteTuristico,
);
paqueteTuristicoRoutes.get(
  '/:id',
  /*
    #swagger.tags = ['Paquetes Turísticos']
    #swagger.summary = 'Obtener un paquete turístico por ID'
    #swagger.description = 'Devuelve un paquete turístico activo según su ID'
    #swagger.parameters['id'] = { description: 'ID del paquete turístico' }
    #swagger.responses[200] = {
      description: 'Paquete encontrado',
    }
    #swagger.responses[404] = { 
      description: 'Paquete no encontrado o dado de baja'
    }
  */
  paqueteTuristicoController.getPaqueteTuristicoById,
);
paqueteTuristicoRoutes.put(
  '/:id',
  /*
    #swagger.tags = ['Paquetes Turísticos']
    #swagger.summary = 'Actualizar un paquete turístico'
    #swagger.description = 'Modifica los datos de un paquete turístico existente, validando duración con reservas activas y nombre duplicado'
    #swagger.parameters['id'] = { description: 'ID del paquete turístico' }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar',
      schema: { $ref: '#/definitions/updatePaqueteTuristico' }
    }
    #swagger.responses[200] = {
      description: 'Paquete actualizado correctamente',
    }
    #swagger.responses[404] = { 
      description: 'Paquete no encontrado, duración no modificable o nombre duplicado'
    }
  */
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.updatePaqueteTuristico,
);
paqueteTuristicoRoutes.delete(
  '/:id',
  /*
    #swagger.tags = ['Paquetes Turísticos']
    #swagger.summary = 'Eliminar (dar de baja) un paquete turístico'
    #swagger.description = 'Realiza un borrado lógico, marcando el paquete como inactivo'
    #swagger.parameters['id'] = { 
      description: 'ID del paquete turístico'
    }
    #swagger.responses[204] = { 
      description: 'Paquete eliminado correctamente'
    }
    #swagger.responses[404] = { 
      description: 'Paquete no encontrado o ya eliminado'
    }
  */
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  paqueteTuristicoController.deletePaqueteTuristico,
);

module.exports = paqueteTuristicoRoutes;
