const express = require('express');
const clienteController = require('../controllers/cliente.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const clienteRoutes = express.Router();

clienteRoutes.use(authMiddleware.verifyUserToken);
clienteRoutes.use(authMiddleware.authorizeByRole(['Gerente', 'Recepcionista']));

clienteRoutes.get('/',
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'Obtener lista de clientes'
    #swagger.description = 'Devuelve el listado de todos los clientes activos'
    #swagger.responses[200] = {
      description: 'Lista de clientes obtenida correctamente'
    }
    #swagger.responses[500] = {
      description: 'Error al obtener los clientes'
    }
  */
  clienteController.getClientes
);

clienteRoutes.post('/',
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'Crear un nuevo cliente'
    #swagger.description = 'Registra un nuevo cliente. Falla si el DNI ya está registrado'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/createCliente' }
    }
    #swagger.responses[201] = {
      description: 'Cliente creado correctamente'
    }
    #swagger.responses[400] = {
      description: 'El DNI ya se encuentra registrado'
    }
  */
  clienteController.createCliente
);

clienteRoutes.get('/:id',
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'Actualizar un cliente'
    #swagger.description = 'Actualiza los datos de un cliente activo. Valida DNI duplicado si se envía'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID del cliente'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/updateCliente' }
    }
    #swagger.responses[200] = {
      description: 'Cliente actualizado correctamente',
    }
    #swagger.responses[404] = {
      description: 'Cliente no encontrado, dado de baja, o DNI duplicado',
    }
  */
  clienteController.getClienteById
);

clienteRoutes.put('/:id',
  /*
    #swagger.tags = ['Clientes']
    #swagger.summary = 'Eliminar (baja lógica) un cliente'
    #swagger.description = 'Marca un cliente como inactivo (activo: false)'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'ID del cliente'
    }
    #swagger.responses[204] = {
      description: 'Cliente eliminado correctamente (sin contenido)'
    }
    #swagger.responses[404] = {
      description: 'Cliente no encontrado o ya eliminado',
    }
  */
  clienteController.updateCliente
);
clienteRoutes.delete('/:id', clienteController.deleteCliente);

module.exports = clienteRoutes;
