const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioService = require('../services/usuario.service');
const Cliente = require('../models/cliente.model');
const Empleado = require('../models/empleado.model');
const getRol = require('../utils/role.util');
const { sendEmail } = require('../services/email.service');

const authService = {};

authService.registerUsuario = async (datosRegistro) => {
    const usuario = await usuarioService.addUsuario(datosRegistro);

    sendEmail(
        usuario.correoElectronico,
        '¡Bienvenido a nuestro sistema de reservas!',
        `Hola ${usuario.correoElectronico}, tu cuenta ha sido creada con éxito.`
    ).catch(error => {
        console.error('Error al enviar correo de bienvenida:', error);
    });

    const rol = getRol(usuario);

    const token = jwt.sign(
        { usuarioId: usuario.id, rol: rol },
        process.env.JWT_SECRET_KEY
    );

    return { token, usuario: usuario };
};

authService.loginUsuario = async (correoElectronico, contraseña) => {
    if (!correoElectronico || !contraseña) {
        throw new Error('Credenciales incorrectas.');
    }

    const usuario = await Usuario.findOne({
        where: {
            correoElectronico: correoElectronico,
            activo: true,
        },
        include: [
            {
                model: Cliente,
                as: 'cliente',
            },
            {
                model: Empleado,
                as: 'empleado',
            },
        ],
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado.');
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
        throw new Error('Contraseña incorrecta.');
    }

    const rol = getRol(usuario);

    const token = jwt.sign(
        { usuarioId: usuario.id, rol: rol },
        process.env.JWT_SECRET_KEY
    );

    return { token, rol };
};

authService.generarTokenGoogle = (usuario) => {
    const rol = getRol(usuario);
    const token = jwt.sign(
        { usuarioId: usuario.id, rol: rol },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = authService;
