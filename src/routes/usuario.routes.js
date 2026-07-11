const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const usuarioRoutes = express.Router();

usuarioRoutes.use(authMiddleware.verifyUserToken);
usuarioRoutes.use(authMiddleware.authorizeByRole(['Gerente']));

usuarioRoutes.get('/',
  /*
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Obtener listado de usuarios'
    #swagger.description = 'Devuelve todos los usuarios activos. Requiere rol Gerente'
    #swagger.responses[200] = { description: 'Listado obtenido correctamente' }
    #swagger.responses[500] = { description: 'Error al obtener los usuarios' }
  */
  usuarioController.getUsuarios
);
usuarioRoutes.post('/',
  /*
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Crear un nuevo usuario'
    #swagger.description = 'Crea un usuario a partir de los datos enviados. Requiere rol Gerente'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del usuario a crear',
      required: true,
      schema: { $ref: '#/definitions/createUsuario' }
    }
    #swagger.responses[201] = { 
      description: 'Usuario creado correctamente'
    }
    #swagger.responses[400] = {
      description: 'Error de validación. Puede ocurrir si el correo ya está registrado'
    }
  */
  usuarioController.createUsuario
);
usuarioRoutes.get('/:id',
  /*
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Obtener un usuario por ID'
    #swagger.description = 'Devuelve los datos de un usuario activo específico. Requiere rol Gerente'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID del usuario', 
      required: true, 
      type: 'integer' 
    }
    #swagger.responses[200] = { 
      description: 'Usuario encontrado'
    }
    #swagger.responses[404] = { 
      description: 'Usuario no encontrado'
    }
  */
  usuarioController.getUsuarioById
);
usuarioRoutes.put('/:id',
  /*
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Actualizar un usuario'
    #swagger.description = 'Actualiza los datos de un usuario existente. Requiere rol Gerente'
    #swagger.parameters['id'] = { 
      in: 'path', 
      description: 'ID del usuario', 
      required: true, 
      type: 'integer' 
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar',
      required: true,
      schema: { $ref: '#/definitions/updateUsuario' }
    }
    #swagger.responses[200] = {
      description: 'Usuario actualizado correctamente',
    }
    #swagger.responses[404] = {
      description: 'Usuario no encontrado o error de validación',
    }
  */
  usuarioController.updateUsuario
);
usuarioRoutes.delete('/:id',
  /*
    #swagger.tags = ['Usuarios']
    #swagger.summary = 'Eliminar un usuario'
    #swagger.description = 'Elimina lógicamente un usuario (soft delete, activo=false). Requiere rol Gerente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del usuario',
      required: true,
      type: 'integer'
    }
    #swagger.responses[204] = {
      description: 'Usuario eliminado correctamente'
    }
    #swagger.responses[404] = {
      description: 'Usuario no encontrado',
    }
  */
  usuarioController.deleteUsuario
);

module.exports = usuarioRoutes;
