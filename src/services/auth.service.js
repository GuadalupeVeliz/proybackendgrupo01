const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioService = require('../services/usuario.service');
const { Usuario, Cliente, Empleado } = require('../models');
const getRol = require('../utils/rol.util');

const authService = {};

authService.signUp = async (data) => {
  if (data.token) {
    const payload = jwt.verify(data.token, process.env.JWT_TEMP_SECRET);
    data.googleId = payload.sub;
  }

  const nuevoUsuario = await usuarioService.addUsuario(data);

  const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.id, {
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  const rol = getRol(usuarioCompleto);

  const token = jwt.sign(
    { usuarioId: usuarioCompleto.id, rol },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );
  usuarioCompleto.rol=rol;
  return {
    token: token,
    rol: rol,
    correo: usuarioCompleto.correoElectronico,
    clienteId: usuarioCompleto.cliente?.id ?? null,
    empleadoId: usuarioCompleto.empleado?.id ?? null,
    usuario: usuarioCompleto,
  };
};

authService.login = async (correoElectronico, clave) => {
  if (!correoElectronico || !clave) {
    throw new Error('Credenciales incorrectas.');
  }

  const usuarioEncontrado = await Usuario.findOne({
    where: {
      correoElectronico: correoElectronico,
      eliminado: false,
    },
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  if (!usuarioEncontrado) {
    throw new Error('Usuario no encontrado o dado de baja.');
  }

  if (!usuarioEncontrado.clave) {
    throw new Error(
      'Esta cuenta se registró con Google. Iniciá sesión con el botón de Google.',
    );
  }

  const isContrasenaCorrecta = await bcrypt.compare(clave, usuarioEncontrado.clave);

  if (!isContrasenaCorrecta) {
    throw new Error('Contraseña incorrecta.');
  }

  const rol = getRol(usuarioEncontrado);
  const now = new Date();

  usuarioEncontrado.ultimoAcceso = now;
  await usuarioEncontrado.save();
  const token = jwt.sign(
    { usuarioId: usuarioEncontrado.id, rol },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );
  usuarioEncontrado.rol = rol;
  return {
    token,
    rol,
    correo: usuarioEncontrado.correoElectronico,
    clienteId: usuarioEncontrado.cliente?.id ?? null,
    empleadoId: usuarioEncontrado.empleado?.id ?? null,
    usuarioEncontrado
  };
};

module.exports = authService;
