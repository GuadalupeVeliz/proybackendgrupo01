const express = require('express');

const authService = require('../services/auth.service');
const googleAuthService = require('../services/google.auth.service');
const googleAuthController = require('../controllers/google-auth.controller');

const googleAuthRoutes = express.Router();

googleAuthRoutes.post('/signup', 
    /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Registro con Google'
    #swagger.description = 'Verifica el ID token de Google y devuelve un token temporal 
      junto con los datos del usuario (email, nombre, foto) para completar el registro. 
      No crea el usuario en la base todavía, eso ocurre en un paso posterior.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/googleAuthCredential' }
    }
    #swagger.responses[200] = {
      description: 'Token temporal generado correctamente',
      schema: { $ref: '#/definitions/googleSignupResponse' }
    }
    #swagger.responses[400] = { 
      description: 'Credencial de Google inválida o expirada'
    }
  */
    googleAuthController.signup);

googleAuthRoutes.post('/signin', 
     /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Inicio de sesión con Google'
    #swagger.description = 'Verifica el ID token de Google, busca el usuario asociado 
      (activo y no eliminado) y devuelve un JWT junto con su rol (Cliente o Empleado) 
      y el ID correspondiente según ese rol.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/googleAuthCredential' }
    }
    #swagger.responses[200] = {
      description: 'Login exitoso',
      schema: { $ref: '#/definitions/googleSigninResponse' }
    }
    #swagger.responses[400] = { 
      description: 'Credenciales de Google incompletas'
    }
    #swagger.responses[404] = { 
      description: 'Usuario no encontrado o dado de baja'
    }
  */
    googleAuthController.signin);

module.exports = googleAuthRoutes;