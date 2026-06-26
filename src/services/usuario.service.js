const Usuario = require('../models/usuario.model');

const usuarioService = {};

usuarioService.addUsuario = async (datosUsuario) => {
    const usuario = await Usuario.findOne({
        where: {
            correoElectronico: datosUsuario.correoElectronico,
        },
    });

    if (usuario) {
        throw new Error('El correo electronico se encuentra registrado.');
    }

    return await Usuario.create(datosUsuario);
};

usuarioService.findUsuarios = async () => {
    return await Usuario.findAll();
};

usuarioService.findUsuario = async (usuarioId) => {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        throw new Error('Usuario no encontrado.');
    }

    return usuario;
};

usuarioService.editUsuario = async (usuarioId, datosUsuario) => {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        throw new Error('Usuario no encontrado.');
    }

    return await usuario.update(datosUsuario);
};

usuarioService.deleteUsuario = async (usuarioId) => {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        throw new Error('Usuario no encontrado.');
    }

    return await usuario.destroy();
};

module.exports = usuarioService;
