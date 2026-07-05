const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioService = require('../services/usuario.service');
const Cliente = require('../models/cliente.model');
const Empleado = require('../models/empleado.model');
const getRol = require('../utils/rol.util');
const { sendEmail } = require('../services/email.service');

const authService = {};

authService.signUp = async (data) => {
  const newUsuario = await usuarioService.addUsuario(data);

  // sendEmail(
  //     usuario.correoElectronico,
  //     '¡Bienvenido a nuestro sistema de reservas!',
  //     `Hola ${usuario.correoElectronico}, tu cuenta ha sido creada con éxito.`
  // ).catch((error) => {
  //     console.error('Error al enviar correo de bienvenida:', error);
  // });

  const rol = getRol(newUsuario);
  const token = jwt.sign(
    {
      usuarioId: newUsuario.id,
      rol: rol,
    },
    process.env.JWT_SECRET_KEY
  );

  return { token: token, usuario: newUsuario };
};

authService.signIn = async (correoElectronico, clave) => {
  if (!correoElectronico || !clave) {
    throw new Error('Credenciales incorrectas.');
  }

  const existingUsuario = await Usuario.findOne({
    where: {
      correoElectronico: correoElectronico,
      eliminado: false,
    },
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado o dado de bajo.');
  }

  const isClaveValid = await bcrypt.compare(clave, existingUsuario.clave);

  if (!isClaveValid) {
    throw new Error('Contraseña incorrecta.');
  }

  const rol = getRol(existingUsuario);

  const token = jwt.sign(
    {
      usuarioId: existingUsuario.id,
      rol: rol,
    },
    process.env.JWT_SECRET_KEY
  );

  return { token, rol };
};

// authService.generarTokenGoogle = (usuario) => {
//   const rol = getRol(usuario);
//   const token = jwt.sign({ usuarioId: usuario.id, rol: rol }, process.env.JWT_SECRET_KEY, {
//     expiresIn: '1h',
//   });
//   return token;
// };

module.exports = authService;
