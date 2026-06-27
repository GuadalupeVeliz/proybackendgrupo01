const Cliente = require('../models/cliente.model');

const clienteService = {};

clienteService.addCliente = async (datosCliente) => {
    const cliente = await Cliente.findOne({
        where: {
            dni: datosCliente.dni,
        },
    });

    if (cliente) {
        throw new Error('El dni se encuentra registrado.');
    }

    return await Cliente.create(datosCliente);
};

clienteService.findClientes = async () => {
    return await Cliente.findAll();
};

clienteService.findCliente = async (clienteId) => {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }

    return cliente;
};

clienteService.editCliente = async (clienteId, datosCliente) => {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }

    return await cliente.update(datosCliente);
};

clienteService.deleteCliente = async (clienteId) => {
    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }

    return await cliente.destroy();
};

module.exports = clienteService;
