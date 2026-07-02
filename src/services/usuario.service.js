const { Cliente, Empleado, Usuario } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const usuarioService = {};

usuarioService.addUsuario = async (datosUsuario) => {
  const usuario = await Usuario.findOne({
    where: {
      correoElectronico: datosUsuario.correoElectronico,
      activo: true,
    },
  });

  if (usuario) {
    throw new Error('El correo electronico se encuentra registrado.');
  }

  if (datosUsuario.contrasena) {
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(
      datosUsuario.contrasena,
      salt
    );
    datosUsuario.contrasena = contraseñaEncriptada;
  }

  const nuevoUsuario = await Usuario.create(datosUsuario);

  if (datosUsuario.legajo) {
    await Empleado.create({
      legajo: datosUsuario.legajo,
      sede: datosUsuario.sede,
      esGerente: datosUsuario.esGerente,
      usuarioId: nuevoUsuario.id,
    });
  } else if (datosUsuario.dni) {
    await Cliente.create({
      dni: datosUsuario.dni,
      nombreCompleto: datosUsuario.nombreCompleto,
      telefono: datosUsuario.telefono,
      usuarioId: nuevoUsuario.id,
    });
  } else {
    await nuevoUsuario.destroy();
    throw new Error(
      'No se proporcionaron datos suficientes para crear un perfil de usuario.'
    );
  }

  return nuevoUsuario;
};

usuarioService.findUsuarios = async () => {
  return await Usuario.findAll({
    where: { activo: true },
  });
};

usuarioService.findUsuario = async (usuarioId) => {
  const usuario = await Usuario.findOne({
    where: { id: usuarioId, activo: true },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }

  return usuario;
};

usuarioService.editUsuario = async (usuarioId, datosUsuario) => {
  const usuario = await Usuario.findOne({
    where: { id: usuarioId, activo: true },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }

  if (datosUsuario.correoElectronico) {
    const dupplicatedCorreoElectronico = await Usuario.findOne({
      where: {
        correoElectronico: datosUsuario.correoElectronico,
        activo: true,
        id: { [Op.ne]: usuarioId },
      },
    });

    if (dupplicatedCorreoElectronico) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
  }

  if (datosUsuario.contrasena) {
    const salt = await bcrypt.genSalt(10);
    datosUsuario.contrasena = await bcrypt.hash(datosUsuario.contrasena, salt);
  }

  return await usuario.update(datosUsuario);
};

usuarioService.deleteUsuario = async (usuarioId) => {
  const usuario = await Usuario.findOne({
    where: { id: usuarioId, activo: true },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }

  return await usuario.update({ activo: false });
};

module.exports = usuarioService;
