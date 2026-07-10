const clienteService = require('../services/cliente.service');

const clienteController = {};

clienteController.createCliente = async (req, res) => {
  try {
    const cliente = await clienteService.addCliente(req.body);
    return res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

clienteController.getClientes = async (req, res) => {
  try {
    const clientes = await clienteService.findClientes();
    return res.status(200).json({ success: true, data: clientes });
  } catch (error) {
    return res.status(500).json({
      mensaje: error.message,
    });
  }
};

clienteController.getClienteById = async (req, res) => {
  try {
    const cliente = await clienteService.findClienteById(req.params.id);
    return res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

clienteController.updateCliente = async (req, res) => {
  try {
    const cliente = await clienteService.editCliente(req.params.id, req.body);
    return res.status(200).json({ success: true, data: cliente });
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

clienteController.deleteCliente = async (req, res) => {
  try {
    await clienteService.deleteCliente(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      mensaje: error.message,
    });
  }
};

module.exports = clienteController;
