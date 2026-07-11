const express = require('express');
const vacanteController = require('../controllers/vacante.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const vacanteRoutes = express.Router();

vacanteRoutes.get(
  '/',
  /*
    #swagger.tags = ['Vacantes']
    #swagger.summary = 'Obtener listado de vacantes'
    #swagger.description = 'Devuelve todas las vacantes activas junto con su paquete turístico asociado, ordenadas por fecha de salida'
    #swagger.responses[200] = {
      description: 'Listado de vacantes obtenido correctamente'
    }
    #swagger.responses[500] = {
      description: 'Error al obtener las vacantes'
    }
  */
  vacanteController.getVacantes,
);
vacanteRoutes.post(
  '/',
  /*
    #swagger.tags = ['Vacantes']
    #swagger.summary = 'Crear una nueva vacante'
    #swagger.description = 'Crea una vacante para un paquete turístico, fecha y cupo específicos. No permite duplicados activos con la misma combinación'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/createVacante' }
    }
    #swagger.responses[201] = {
      description: 'Vacante creada correctamente',
    }
    #swagger.responses[400] = {
      description: 'Ya existe una vacante para ese paquete, fecha y sucursal'
    }
  */
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.createVacante,
);
vacanteRoutes.get(
  '/:id',
  /*
    #swagger.tags = ['Vacantes']
    #swagger.summary = 'Obtener una vacante por ID'
    #swagger.description = 'Devuelve los datos de una vacante activa junto con su paquete turístico asociado'
    #swagger.parameters['id'] = { description: 'ID de la vacante', type: 'integer' }
    #swagger.responses[200] = {
      description: 'Vacante encontrada',
    }
    #swagger.responses[404] = {
      description: 'Vacante no encontrada o dada de baja'
    }
  */
  vacanteController.getVacante,
);
vacanteRoutes.put(
  '/:id',
  /*
    #swagger.tags = ['Vacantes']
    #swagger.summary = 'Actualizar una vacante'
    #swagger.description = 'Actualiza los datos de una vacante activa. Si se modifica el cupo total, recalcula el cupo disponible en base a las reservas ya asociadas'
    #swagger.parameters['id'] = { description: 'ID de la vacante', type: 'integer' }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/updateVacante' }
    }
    #swagger.responses[200] = {
      description: 'Vacante actualizada correctamente'
    }
    #swagger.responses[404] = {
      description: 'Vacante no encontrada, dada de baja, cupo inválido o duplicada'
    }
  */
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.updateVacante,
);
vacanteRoutes.delete(
  '/:id',
  /*
    #swagger.tags = ['Vacantes']
    #swagger.summary = 'Dar de baja una vacante'
    #swagger.description = 'Marca una vacante como inactiva (borrado lógico). No permite la baja si ya posee reservas asociadas'
    #swagger.parameters['id'] = { description: 'ID de la vacante', type: 'integer' }
    #swagger.responses[204] = {
      description: 'Vacante dada de baja correctamente'
    }
    #swagger.responses[404] = {
      description: 'Vacante no encontrada, ya eliminada, o con reservas asociadas'
    }
  */
  authMiddleware.verifyUserToken,
  authMiddleware.authorizeByRole(['Gerente']),
  vacanteController.deleteVacante,
);

module.exports = vacanteRoutes;
