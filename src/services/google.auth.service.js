const { OAuth2Client } = require('google-auth-library');
const { Usuario, Cliente, Empleado } = require('../models');
const jwt = require('jsonwebtoken');
const getRol = require('../utils/rol.util');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthService = {};

googleAuthService.signup = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub, email, name, picture } = ticket.getPayload();

  const tempToken = jwt.sign({ sub }, process.env.JWT_TEMP_SECRET, {
    expiresIn: '10m',
  });

  return { tempToken, email, name, picture };
};

googleAuthService.signin = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub, email } = ticket.getPayload();

  if (!sub || !email) {
    throw new Error('Credenciales de Google incompletas.');
  }

  const usuarioEncontrado = await Usuario.findOne({
    where: {
      googleId: sub,
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

  const rol = getRol(usuarioEncontrado);

  const token = jwt.sign(
    { usuarioId: usuarioEncontrado.id, rol },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );

  return {
    token,
    correo: email,
    rol,
    clienteId: usuarioEncontrado.cliente?.id ?? null,
    empleadoId: usuarioEncontrado.empleado?.id ?? null,
  };
};

module.exports = googleAuthService;