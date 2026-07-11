const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const perfilController = require('../controllers/perfil.controller');

const perfilRoutes = express.Router();

perfilRoutes.use(authMiddleware.verifyUserToken);
perfilRoutes.use(authMiddleware.authorizeByRole(['Gerente', 'Recepcionista', 'Cliente']));

perfilRoutes.get('/',
  /*
    #swagger.tags = ['Perfil']
    #swagger.summary = 'Obtener perfil del usuario logueado'
    #swagger.description = 'Devuelve los datos del usuario autenticado, incluyendo detalles de cliente o empleado según corresponda'
    #swagger.responses[200] = {
      description: 'Perfil obtenido correctamente'
    }
    #swagger.responses[500] = {
      description: 'Error al obtener el perfil'
    }
  */
  perfilController.getPerfil
);
perfilRoutes.put('/',
  /*
    #swagger.tags = ['Perfil']
    #swagger.summary = 'Actualizar perfil del usuario logueado'
    #swagger.description = 'Actualiza correo, contraseña y datos de cliente o empleado según el usuario autenticado'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del perfil',
      schema: {
        correoElectronico: "nuevo@ejemplo.com",
        contrasena: "nuevaContrasena123",
        telefono: "1122334455",
        nombreCompleto: "Juan Perez",
        sede: "Centro"
      }
    }
    #swagger.responses[200] = {
      description: 'Perfil actualizado correctamente'
    }
    #swagger.responses[400] = {
      description: 'Error al actualizar el perfil'
    }
  */
  perfilController.updatePerfil
);

module.exports = perfilRoutes;
