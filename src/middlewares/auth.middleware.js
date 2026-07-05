const jwt = require('jsonwebtoken');
const getRol = require('../utils/rol.util');
const { Usuario, Cliente, Empleado } = require('../models');

const authMiddleware = {};

authMiddleware.verifyUserToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const existingUsuario = await Usuario.findByPk(decoded.usuarioId, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
      ],
    });

    if (!existingUsuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado.',
      });
    }

    req.usuarioLogged = existingUsuario;
    req.usuarioLogged.rol = getRol(existingUsuario);

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.', error: error.message });
  }
};

authMiddleware.authorizeByRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.usuarioLogged || !allowedRoles.includes(req.usuarioLogged.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado: No cuenta con los permisos necesarios.',
      });
    }
    next();
  };
};

module.exports = authMiddleware;
