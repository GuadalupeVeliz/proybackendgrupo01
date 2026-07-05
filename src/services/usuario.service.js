const { Cliente, Empleado, Usuario } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const empleadoService = require('../services/empleado.service');
const clienteService = require('../services/cliente.service');

const usuarioService = {};

usuarioService.addUsuario = async (data) => {
  const existingCorreoElectronico = await Usuario.findOne({
    where: {
      correoElectronico: data.correoElectronico,
      eliminado: false,
    },
  });

  if (existingCorreoElectronico) {
    throw new Error(
      'El correo electrónico ya está registrado (puede que pertenezca a un usuario dado de baja).',
    );
  }

  if (data.clave) {
    const salt = await bcrypt.genSalt(10);
    const encryptedClave = await bcrypt.hash(data.clave, salt);
    data.clave = encryptedClave;
  }

  const newUsuario = await Usuario.create(data);

  if (data.legajo) {
    await empleadoService.addEmpleado({
      legajo: data.legajo,
      sede: data.sede,
      esGerente: data.esGerente,
      usuarioId: newUsuario.id,
    });
  } else if (data.dni) {
    await clienteService.addCliente({
      dni: data.dni,
      nombreCompleto: data.nombreCompleto,
      telefono: data.telefono,
      usuarioId: newUsuario.id,
    });
  } else {
    await newUsuario.destroy();
    throw new Error('No se proporcionaron datos suficientes para crear un perfil de usuario.');
  }

  return newUsuario;
};

usuarioService.findUsuarios = async (filters = { eliminado: false }) => {
  return await Usuario.findAll({ where: filters });
};

usuarioService.findUsuarioById = async (id) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado o dado de bajo.');
  }

  return existingUsuario;
};

usuarioService.editUsuario = async (id, updates) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado o dado de bajo.');
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
    throw new Error('Usuario no encontrado o dado de bajo.');
  }

  return await existingUsuario.update({ eliminado: true });
};

module.exports = usuarioService;
