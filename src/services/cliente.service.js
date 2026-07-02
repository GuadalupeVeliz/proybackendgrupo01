const { Cliente } = require('../models');
const { Op } = require('sequelize');

const clienteService = {};

clienteService.addCliente = async (datosCliente) => {
  const cliente = await Cliente.findOne({
    where: {
      dni: datosCliente.dni,
      activo: true,
    },
  });

  if (cliente) {
    throw new Error('El dni se encuentra registrado.');
  }

  return await Cliente.create(datosCliente);
};

clienteService.findClientes = async () => {
  return await Cliente.findAll({
    where: { activo: true },
  });
};

clienteService.findCliente = async (clienteId) => {
  const cliente = await Cliente.findOne({
    where: { id: clienteId, activo: true },
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado o dado de baja.');
  }

  return cliente;
};

clienteService.editCliente = async (clienteId, datosCliente) => {
  const cliente = await Cliente.findOne({
    where: { id: clienteId, activo: true },
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado o dado de baja.');
  }

  if (datosCliente.dni) {
    const duplicatedDni = await Cliente.findOne({
      where: {
        dni: datosCliente.dni,
        activo: true,
        id: { [Op.ne]: clienteId },
      },
    });

    if (duplicatedDni) {
      throw new Error('El DNI ya se encuentra registrado por otro cliente.');
    }
  }

  return await cliente.update(datosCliente);
};

clienteService.deleteCliente = async (clienteId) => {
  const cliente = await Cliente.findOne({
    where: { id: clienteId, activo: true },
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado o ya eliminado.');
  }

  return await cliente.update({ activo: false });
};

module.exports = clienteService;
