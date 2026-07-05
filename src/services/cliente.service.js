const { Cliente } = require('../models');
const { Op } = require('sequelize');

const clienteService = {};

clienteService.addCliente = async (data) => {
  const existingDni = await Cliente.findOne({
    where: {
      dni: data.dni,
      activo: true,
    },
  });

  if (existingDni) {
    throw new Error('El dni se encuentra registrado.');
  }

  return await Cliente.create(data);
};

clienteService.findClientes = async (filters = { eliminado: false }) => {
  return await Cliente.findAll({
    where: filters,
  });
};

clienteService.findClienteById = async (id) => {
  const cliente = await Cliente.findOne({
    where: { id: id, eliminado: false },
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado o dado de baja.');
  }

  return cliente;
};

clienteService.editCliente = async (id, updates) => {
  const existingCliente = await Cliente.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingCliente) {
    throw new Error('Cliente no encontrado o dado de baja.');
  }

  if (updates.dni) {
    const existingDni = await Cliente.findOne({
      where: {
        dni: updates.dni,
        eliminado: false,
        id: { [Op.ne]: id },
      },
    });

    if (existingDni) {
      throw new Error('El DNI ya se encuentra registrado por otro cliente.');
    }
  }

  return await existingCliente.update(updates);
};

clienteService.deleteCliente = async (id) => {
  const existingCliente = await Cliente.findOne({
    where: { id: id, eliminado: false },
  });

  if (!existingCliente) {
    throw new Error('Cliente no encontrado o ya eliminado.');
  }

  return await existingCliente.update({ eliminado: true });
};

module.exports = clienteService;
