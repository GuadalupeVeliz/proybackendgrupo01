const { Usuario, Cliente, Empleado } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const perfilService = {};

perfilService.findPerfil = async (id) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
    attributes: { exclude: ['clave'] },
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado.');
  }

  return existingUsuario;
};

perfilService.editPerfil = async (id, updates) => {
  const existingUsuario = await Usuario.findOne({
    where: { id: id, eliminado: false },
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  if (!existingUsuario) {
    throw new Error('Usuario no encontrado.');
  }

  const mappedData = {};

  if (updates.correoElectronico) {
    const existingCorreoElectronico = await Usuario.findOne({
      where: {
        correoElectronico: updates.correoElectronico,
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (existingCorreoElectronico) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
    mappedData.correoElectronico = updates.correoElectronico;
  }

  const nuevaClave = updates.clave ?? updates.contrasena;

  if (nuevaClave) {
    const salt = await bcrypt.genSalt(10);
    mappedData.clave = await bcrypt.hash(nuevaClave, salt);
  }

  if (Object.keys(mappedData).length > 0) {
    await existingUsuario.update(mappedData);
  }

  if (updates.telefono || updates.nombreCompleto) {
    if (!existingUsuario.cliente) {
      throw new Error('El usuario no es un cliente, no puede actualizar datos de cliente.');
    }
    await existingUsuario.cliente.update({
      telefono: updates.telefono ?? existingUsuario.cliente.telefono,
      nombreCompleto: updates.nombreCompleto ?? existingUsuario.cliente.nombreCompleto,
    });
  }

  if (updates.sede) {
    if (!existingUsuario.empleado) {
      throw new Error('El usuario no es un empleado, no puede actualizar datos de empleado.');
    }

    await existingUsuario.empleado.update({
      sede: updates.sede ?? existingUsuario.empleado.sede,
    });
  }

  return await perfilService.findPerfil(id);
};

module.exports = perfilService;
