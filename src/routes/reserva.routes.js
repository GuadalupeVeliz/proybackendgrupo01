const express = require('express');
const reservaController = require('../controllers/reserva.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const reservaRoutes = express.Router();

reservaRoutes.use(authMiddleware.verifyUserToken);

reservaRoutes.get(
  '/',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Obtener todas las reservas'
    #swagger.description = 'Devuelve el listado de reservas activas con datos de cliente y vacante incluidos'
    #swagger.responses[200] = {
      description: 'Listado obtenido correctamente'
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener reservas' 
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservas,
);

reservaRoutes.post(
  '/',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Crear una nueva reserva'
    #swagger.description = 'Crea una reserva validando disponibilidad de cupos en la vacante indicada'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/definitions/createReserva' 
      }
    }
    #swagger.responses[201] = {
      description: 'Reserva creada con éxito'
    }
    #swagger.responses[400] = { 
      description: 'Datos inválidos, cliente/vacante inexistente o sin cupos disponibles'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.createReserva,
);

reservaRoutes.get(
  '/:id',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Obtener una reserva por ID'
    #swagger.description = 'Devuelve los datos de una reserva activa según su ID'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID de la reserva', 
      required: true, 
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Reserva encontrada',
    }
    #swagger.responses[404] = { 
      description: 'Reserva no encontrada'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservaById,
);

reservaRoutes.put(
  '/:id',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Actualizar una reserva'
    #swagger.description = 'Modifica los datos de una reserva existente, revalidando cupos si cambia la vacante o cantidad de personas'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID de la reserva', 
      required: true, 
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $ref: '#/definitions/createReserva'
      }
    }
    #swagger.responses[200] = {
      description: 'Reserva actualizada con éxito'
    }
    #swagger.responses[404] = { 
      description: 'Reserva no existe o no encontrada'
    }
    #swagger.responses[400] = { 
      description: 'Datos inválidos o sin cupos disponibles'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  reservaController.updateReserva,
);

reservaRoutes.delete(
  '/:id',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Eliminar una reserva'
    #swagger.description = 'Realiza un borrado lógico de la reserva (activo=false) y restaura el cupo si no estaba cancelada'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID de la reserva', 
      required: true, 
      type: 'integer' 
    }
    #swagger.responses[204] = { 
      description: 'Reserva eliminada correctamente'
    }
    #swagger.responses[404] = { 
      description: 'Reserva no encontrada o ya fue eliminada previamente'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']),
  reservaController.deleteReserva,
);

reservaRoutes.get(
  '/cliente/:clienteId',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Obtener reservas por cliente'
    #swagger.description = 'Devuelve todas las reservas activas asociadas a un cliente específico'
    #swagger.parameters['clienteId'] = { 
      in: 'path', 
      description: 'ID del cliente', 
      required: true, 
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Reservas encontradas'
    }
    #swagger.responses[404] = { 
      description: 'No se encontraron reservas para este cliente'
    }
    #swagger.responses[400] = { 
      description: 'Error al procesar la solicitud'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.getReservasByClienteId,
);

reservaRoutes.put(
  '/checkout/:id',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Confirmar (checkout) una reserva'
    #swagger.description = 'Confirma una reserva validando el monto pagado y genera el comprobante correspondiente'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID de la reserva', 
      required: true, 
      type: 'integer' 
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { montoPagado: 15000 }
    }
    #swagger.responses[200] = {
      description: 'Reserva confirmada'
    }
    #swagger.responses[404] = { 
      description: 'Reserva no encontrada'
    }
    #swagger.responses[400] = {
      description: 'Reserva ya confirmada, cancelada o monto insuficiente'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.checkoutReserva,
);

reservaRoutes.put(
  '/cancel/:id',
  /*
    #swagger.tags = ['Reservas']
    #swagger.summary = 'Cancelar una reserva'
    #swagger.description = 'Cancela una reserva activa y restaura el cupo correspondiente en la vacante'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID de la reserva', 
      required: true, 
      type: 'integer' 
    }
    #swagger.responses[200] = {
      description: 'Reserva cancelada'
    }
    #swagger.responses[404] = { 
      description: 'Reserva no encontrada'
    }
    #swagger.responses[400] = { 
      description: 'La reserva ya se encuentra cancelada'
    }
  */
  authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']),
  reservaController.cancelReserva,
);

module.exports = reservaRoutes;
