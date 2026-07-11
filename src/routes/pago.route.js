const express = require('express');
const pagoController = require('../controllers/pago.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const pagoRoutes = express.Router();

pagoRoutes.use(authMiddleware.verifyUserToken);
pagoRoutes.use(authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']));

pagoRoutes.get('/', 
    /*
    #swagger.tags = ['Pagos']
    #swagger.summary = 'Listar pagos'
    #swagger.description = 'Devuelve todos los pagos activos junto con la reserva asociada'
    #swagger.responses[200] = {
      description: 'Lista de pagos obtenida correctamente'
    }
    #swagger.responses[500] = {
      description: 'Error al obtener los pagos'
    }
  */
    pagoController.getPagos);

pagoRoutes.post('/', 
    /*
    #swagger.tags = ['Pagos']
    #swagger.summary = 'Registrar pago manual'
    #swagger.description = 'Crea un pago manual asociado a una reserva. Si el estado es "pagado", confirma la reserva y genera comprobante'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        { $ref: '#/definitions/createPago' }
      }
    }
    #swagger.responses[201] = {
      description: 'Pago manual creado exitosamente'
    }
    #swagger.responses[400] = {
      description: 'Datos faltantes, reserva inexistente o cancelada'
    }
  */
    pagoController.createPago);

pagoRoutes.get('/:id', 
    /*
    #swagger.tags = ['Pagos']
    #swagger.summary = 'Obtener un pago por ID'
    #swagger.description = 'Devuelve un pago específico junto con su reserva asociada'
    #swagger.parameters['id'] = { 
      in: 'path', 
      required: true, 
      type: 'integer', description: 'ID del pago'
    }
    #swagger.responses[200] = {
      description: 'Pago encontrado'
    }
    #swagger.responses[404] = {
      description: 'Pago no encontrado'
    }
  */
    pagoController.getPagoById);

pagoRoutes.put('/:id', 
    /*
    #swagger.tags = ['Pagos']
    #swagger.summary = 'Actualizar un pago'
    #swagger.description = 'Actualiza los datos de un pago existente.'
    #swagger.parameters['id'] = { 
      in: 'path', 
      required: true, 
      type: 'integer', 
      description: 'ID del pago' 
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/updatePago' }
    }
    #swagger.responses[200] = {
      description: 'Pago actualizado exitosamente'
    }
    #swagger.responses[400] = {
      description: 'Pago no encontrado o datos inválidos'
    }
  */
    pagoController.updatePago);

pagoRoutes.delete('/:id',
    /*
    #swagger.tags = ['Pagos']
    #swagger.summary = 'Eliminar un pago'
    #swagger.description = 'Elimina lógicamente un pago (activo = false). Si la reserva estaba confirmada, la revierte a pendiente y anula el comprobante'
    #swagger.parameters['id'] = { 
      in: 'path', 
      required: true, 
      type: 'integer', 
      description: 'ID del pago'
    }
    #swagger.responses[200] = {
      description: 'Pago eliminado exitosamente'
    }
    #swagger.responses[404] = {
      description: 'Pago no encontrado o ya fue eliminado'
    }
  */
    pagoController.deletePago);

module.exports = pagoRoutes;
