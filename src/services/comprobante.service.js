const Comprobante = require('../models/comprobante.model');
const Reserva = require('../models/reserva.model');
const Cliente = require('../models/cliente.model');
const Vacante = require('../models/vacante.model');
const PaqueteTuristico = require('../models/paqueteTuristico.model');

// Integración con el módulo de vacante.service
const vacanteService = require('./vacante.service'); 

const comprobanteService = {};

// Función auxiliar para manejar errores limpiamente
const crearError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

// ==========================================
// LÓGICA DE NEGOCIO Y CONSULTAS COMPLEJAS
// ==========================================

comprobanteService.obtenerComprobantesPorClienteId = async (clienteId) => {
    return await Comprobante.findAll({
        include: [{
            model: Reserva,
            as: 'reserva',
            required: true,
            include: [
                { 
                    model: Cliente, 
                    as: 'cliente',
                    where: { id: clienteId } 
                },
                { 
                    model: Vacante, 
                    as: 'vacante',
                    include: [{ model: PaqueteTuristico, as: 'paquete' }] // Alias corregido
                }
            ]
        }]
    });
};

comprobanteService.obtenerDatosComprobanteParaPDF = async (id) => {
    const comprobante = await Comprobante.findByPk(id, {
        include: [{
            model: Reserva,
            as: 'reserva',
            include: [
                { model: Cliente, as: 'cliente' },
                { 
                    model: Vacante, 
                    as: 'vacante', 
                    include: [{ model: PaqueteTuristico, as: 'paquete' }] // Alias corregido
                }
            ]
        }]
    });

    if (!comprobante) throw crearError('Comprobante no encontrado', 404);
    
    return comprobante;
};

comprobanteService.procesarCancelacion = async (reservaId) => {
    if (!reservaId) throw crearError('El reservaId es obligatorio', 400);

    const reserva = await Reserva.findByPk(reservaId);
    if (!reserva) throw crearError('Reserva no encontrada', 404);

    if (reserva.estado === 'cancelada') {
        throw crearError('La reserva ya se encuentra cancelada', 400);
    }

    // 1. Actualizamos el estado de la reserva
    await reserva.update({ estado: 'cancelada' });

    // 2. Restauramos el cupo usando el servicio de vacante.service
    // Asumimos 1 lugar devuelto.
    await vacanteService.descontarCupo(reserva.vacanteId, 1);

    // 3. Generamos el comprobante
    const comprobante = await Comprobante.create({
        numero: `CAN-${Date.now()}`,
        fechaEmision: new Date(),
        tipo: 'cancelacion',
        reservaId: reservaId
    });

    return comprobante;
};

// ==========================================
// LÓGICA CRUD ESTÁNDAR
// ==========================================

comprobanteService.obtenerTodos = async () => {
    return await Comprobante.findAll({
        include: [{ model: Reserva, as: 'reserva' }]
    });
};

comprobanteService.obtenerPorId = async (id) => {
    const comprobante = await Comprobante.findByPk(id, {
        include: [{ model: Reserva, as: 'reserva' }]
    });
    if (!comprobante) throw crearError('Comprobante no encontrado', 404);
    return comprobante;
};

comprobanteService.crear = async (data) => {
    return await Comprobante.create(data);
};

comprobanteService.actualizar = async (id, data) => {
    const actualizado = await Comprobante.update(data, { where: { id } });
    if (actualizado[0] === 0) throw crearError('Comprobante no encontrado o sin cambios', 404);
    return true;
};

comprobanteService.eliminar = async (id) => {
    const eliminado = await Comprobante.destroy({ where: { id } });
    if (!eliminado) throw crearError('Comprobante no encontrado', 404);
    return true;
};

module.exports = comprobanteService;