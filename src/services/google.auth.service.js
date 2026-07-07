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

  const token = jwt.sign(
    { sub },
    process.env.JWT_TEMP_SECRET,
    { expiresIn: '3m' }
  );

  return { token, email, name, picture }
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

  const existingUsuario = await Usuario.findOne({
    where: {
      googleId: sub,
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

  const rol = getRol(existingUsuario);

  let payload = {};
  payload.rol = rol;

  if (rol === 'Cliente') {
    payload.clienteId = existingUsuario.cliente.id;
  } else {
    payload.empleadoId = existingUsuario.empleado.id;
  }

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' },
  );

  return { token, correo: email, ...payload };
};

module.exports = googleAuthService;