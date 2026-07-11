const express = require('express');
const passport = require('passport');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const authRoutes = express.Router();

authRoutes.post('/signup',
    /*
		#swagger.tags = ['Auth']
		#swagger.summary = 'Registrar nuevo usuario'
		#swagger.description = 'Crea un nuevo usuario en el sistema y devuelve un token JWT'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Datos del usuario a registrar',
			required: true,
			schema: {
				$ref: '#/definitions/createUsuario'
			}
		}
		#swagger.responses[201] = {
			description: 'Usuario registrado correctamente'
		}
		#swagger.responses[400] = {
			description: 'Error en los datos de registro'
		}
	*/
    authController.signUp);

authRoutes.post('/login',
	/*
		#swagger.tags = ['Auth']
		#swagger.summary = 'Iniciar sesión'
		#swagger.description = 'Autentica un usuario con correo y contraseña, devuelve token JWT y rol'
		#swagger.parameters['body'] = {
			in: 'body',
			description: 'Credenciales del usuario',
			required: true,
			schema: {
				correoElectronico: "usuario@ejemplo.com",
				contrasena: "12345678"
			}
		}
		#swagger.responses[200] = {
			description: 'Login exitoso'
		}
		#swagger.responses[401] = {
			description: 'Credenciales incorrectas'
		}
	*/
    authController.login);

authRoutes.post('/logout',
	/*
		#swagger.tags = ['Auth']
		#swagger.summary = 'Cerrar sesión'
		#swagger.description = 'Finaliza la sesión del usuario actual'
		#swagger.responses[200] = {
			description: 'Sesión cerrada correctamente'
		}
		#swagger.responses[500] = {
			description: 'Error al cerrar sesión',
		}
	*/
    authMiddleware.verifyUserToken, authController.logout);

module.exports = authRoutes;
