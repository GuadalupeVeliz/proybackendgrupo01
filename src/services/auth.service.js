const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioService = require('../services/usuario.service');
const { Usuario, Cliente, Empleado } = require('../models');
const getRol = require('../utils/rol.util');
const { sendEmail } = require('../services/email.service');

const authService = {};

authService.signUp = async (data) => {
  const newUsuario = await usuarioService.addUsuario(data);

  const rol = getRol(newUsuario);
  const token = jwt.sign(
    {
      usuarioId: newUsuario.id,
      rol: rol,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );

  return { token: token, usuario: newUsuario };
};

authService.login = async (correoElectronico, clave) => {
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
    throw new Error('Usuario no encontrado o dado de baja.');
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
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '1h',
    },
  );
  const clienteId = existingUsuario.cliente?.id ?? null
  return { token, rol, clienteId };
};

module.exports = authService;
