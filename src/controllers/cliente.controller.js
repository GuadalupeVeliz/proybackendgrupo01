const clienteService = require('../services/cliente.service');

const clienteController = {};

clienteController.createCliente = async (req, res) => {
    try {
        const cliente = await clienteService.addCliente(req.body);
        return res.status(201).json(cliente);
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
};

clienteController.getClientes = async (req, res) => {
    try {
        const clientes = await clienteService.findClientes();
        return res.status(200).json(clientes);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

clienteController.getCliente = async (req, res) => {
    try {
        const cliente = await clienteService.findCliente(req.params.id);
        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

clienteController.updateCliente = async (req, res) => {
    try {
        const cliente = await clienteService.editCliente(
            req.params.id,
            req.body
        );
        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

clienteController.deleteCliente = async (req, res) => {
    try {
        await clienteService.deleteCliente(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

module.exports = clienteController;
