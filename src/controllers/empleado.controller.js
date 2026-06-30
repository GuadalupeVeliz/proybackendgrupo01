const empleadoService = require('../services/empleado.service');

const empleadoController = {};

empleadoController.createEmpleado = async (req, res) => {
    try {
        const rolUsuarioLogged = req.usuarioLogged.rol;

        if (rolUsuarioLogged !== 'Gerente') {
            return res.status(403).json({ error: 'Acceso denegado. Solo el Gerente puede crear empleados.' });
        }

        const empleado = await empleadoService.addEmpleado(req.body);
        return res.status(201).json(empleado);
    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
};

empleadoController.getEmpleados = async (req, res) => {
    try {
        const empleados = await empleadoService.findEmpleados();
        return res.status(200).json(empleados);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

empleadoController.getEmpleado = async (req, res) => {
    try {
        const empleado = await empleadoService.findEmpleado(req.params.id);
        return res.status(200).json(empleado);
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

empleadoController.updateEmpleado = async (req, res) => {
    try {
        const empleado = await empleadoService.editEmpleado(
            req.params.id,
            req.body
        );
        return res.status(200).json(empleado);
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

empleadoController.deleteEmpleado = async (req, res) => {
    try {
        await empleadoService.deleteEmpleado(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({
            error: error.message,
        });
    }
};

module.exports = empleadoController;
