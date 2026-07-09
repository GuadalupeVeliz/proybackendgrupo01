const { Cliente, Empleado, Usuario } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database.config');
const empleadoService = require('../services/empleado.service');
const clienteService = require('../services/cliente.service');

const usuarioService = {};

usuarioService.addUsuario = async (data) => {
  const correoEncontrado = await Usuario.findOne({
    where: {
      correoElectronico: data.correoElectronico,
      eliminado: false,
    },
  });

  if (correoEncontrado) {
    throw new Error(
      'El correo electrónico ya está registrado (puede que pertenezca a un usuario dado de baja).',
    );
  }

  if (data.googleId) {
    const GoogleIdEncontrado = await Usuario.findOne({
      where: {
        googleId: data.googleId,
        eliminado: false,
      },
    });

    if (GoogleIdEncontrado) {
      throw new Error(
        'La cuenta de Google ya está registrada (puede que pertenezca a un usuario dado de baja).',
      );
    }
  }

  if (!data.clave && !data.googleId) {
    throw new Error('Se requiere una contraseña o una cuenta de Google.');
  }

  if (data.clave) {
    const salt = await bcrypt.genSalt(10);
    data.clave = await bcrypt.hash(data.clave, salt);
  }

  return await sequelize.transaction(async (transaction) => {
    const nuevoUsuario = await Usuario.create(data, { transaction });

    if (data.legajo) {
      nuevoUsuario.rol = data.esGerente ? 'Gerente' : 'Recepcionista';
      await empleadoService.addEmpleado(
        {
          legajo: data.legajo,
          sede: data.sede.toLowerCase(),
          esGerente: data.esGerente,
          usuarioId: nuevoUsuario.id,
        },
        transaction,
      );
    } else if (data.dni) {
      await clienteService.addCliente(
        {
          dni: data.dni,
          nombreCompleto: data.nombreCompleto,
          telefono: data.telefono,
          usuarioId: nuevoUsuario.id,
        },
        transaction,
      );
    } else {
      throw new Error('No se proporcionaron datos suficientes para crear un perfil de usuario.');
    }

    return nuevoUsuario;
  });
};

usuarioService.findUsuarios = async (filters = { eliminado: false }) => {
  return await Usuario.findAll({ where: filters });
};

usuarioService.findUsuarioById = async (id) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado o dado de baja.');
  }

  return existingUsuario;
};

usuarioService.editUsuario = async (id, updates) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado o dado de baja.');
  }

  if (updates.correoElectronico) {
    const existingCorreoElectronico = await Usuario.findOne({
      where: {
        correoElectronico: updates.correoElectronico,
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (existingCorreoElectronico) {
      throw new Error(
        'El correo electrónico ya está registrado (puede que pertenezca a un usuario dado de baja).',
      );
    }
  }

  if (updates.clave) {
    const salt = await bcrypt.genSalt(10);
    updates.clave = await bcrypt.hash(updates.clave, salt);
  }

  return await existingUsuario.update(updates);
};

usuarioService.deleteUsuario = async (id) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado o dado de baja.');
  }

  return await existingUsuario.update({ eliminado: true });
};

module.exports = usuarioService;