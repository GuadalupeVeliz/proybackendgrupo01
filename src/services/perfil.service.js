const { Usuario, Cliente, Empleado } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const perfilService = {};

perfilService.obtenerPerfilConDetalles = async (usuarioId) => {
  const usuario = await Usuario.findOne({
    where: { id: usuarioId, activo: true },
    attributes: { exclude: ['contrasena'] },
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }

  return usuario;
};

perfilService.actualizarPerfilSeguro = async (usuarioId, datosEdicion) => {
  const usuario = await Usuario.findOne({
    where: { id: usuarioId, activo: true },
    include: [
      { model: Cliente, as: 'cliente' },
      { model: Empleado, as: 'empleado' },
    ],
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }

  const datosMapeados = {};

  if (datosEdicion.correoElectronico) {
    const correoDuplicado = await Usuario.findOne({
      where: {
        correoElectronico: datosEdicion.correoElectronico,
        activo: true,
        id: { [Op.ne]: usuarioId },
      },
    });

    if (correoDuplicado) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
    datosMapeados.correoElectronico = datosEdicion.correoElectronico;
  }

  if (datosEdicion.contrasena) {
    const salt = await bcrypt.genSalt(10);
    datosMapeados.contrasena = await bcrypt.hash(datosEdicion.contrasena, salt);
  }

  if (Object.keys(datosMapeados).length > 0) {
    await usuario.update(datosMapeados);
  }

  if (datosEdicion.telefono || datosEdicion.nombreCompleto) {
    if (!usuario.cliente) {
      throw new Error(
        'El usuario no es un cliente, no puede actualizar datos de cliente.'
      );
    }
    await usuario.cliente.update({
      telefono: datosEdicion.telefono ?? usuario.cliente.telefono,
      nombreCompleto:
        datosEdicion.nombreCompleto ?? usuario.cliente.nombreCompleto,
    });
  }

  if (datosEdicion.sede) {
    if (!usuario.empleado) {
      throw new Error(
        'El usuario no es un empleado, no puede actualizar datos de empleado.'
      );
    }
    await usuario.empleado.update({
      sede: datosEdicion.sede ?? usuario.empleado.sede,
    });
  }

  return await perfilService.obtenerPerfilConDetalles(usuarioId);
};

module.exports = perfilService;
