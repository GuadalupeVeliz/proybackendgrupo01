const Pago = require('../models/pago.model'); 
const Reserva = require('../models/reserva.model');
const Comprobante = require('../models/comprobante.model');
const Vacante = require('../models/vacante.model');
const PaqueteTuristico = require('../models/paqueteTuristico.model');

const mercadopagoService = require('./mercadopago.service');
const conversorService = require('./conversor.service');

const pagoService = {};

// Función auxiliar calcada del estilo de tu compañero
const crearError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

pagoService.procesarInicioPago = async (reservaId, monedaOrigen) => {
    if (!reservaId) throw crearError('El reservaId es obligatorio', 400);

    const reserva = await Reserva.findByPk(reservaId, {
        include: [{
            model: Vacante,
            as: 'vacante',
            include: [{ model: PaqueteTuristico, as: 'paquete' }]
        }]
    });

    if (!reserva) throw crearError('Reserva no encontrada', 404);
    if (reserva.estado !== 'pendiente') throw crearError(`No se puede pagar una reserva en estado: ${reserva.estado}`, 400);

    const montoReal = reserva.montoPagado; 
    const tituloParaMP = reserva.vacante.paquete.nombre;
    const monedaFinal = monedaOrigen || 'ARS';

    const montoFinalARS = await conversorService.convertirAMonedaLocal(montoReal, monedaFinal);
    if (!montoFinalARS) throw crearError('Error al calcular la conversión de moneda', 500);

    const initPoint = await mercadopagoService.crearPreferencia(tituloParaMP, montoFinalARS, reservaId);
    if (!initPoint) throw crearError('Error al comunicarse con Mercado Pago', 500);

    return initPoint;
};

pagoService.procesarConfirmacionPago = async (payment_id) => {
    if (!payment_id) throw crearError('El payment_id es obligatorio', 400);

    const datosPago = await mercadopagoService.consultarPago(payment_id);
    if (!datosPago || datosPago.status !== 'approved') {
        throw crearError('El pago no está aprobado o no existe', 400);
    }

    const reservaId = datosPago.external_reference;

    const nuevoPago = await Pago.create({
        fecha: new Date(datosPago.date_approved),
        monto: datosPago.transaction_amount,
        metodoPago: datosPago.payment_method_id,
        estado: 'pagado',
        reservaId: reservaId
    });

    await Reserva.update({ estado: 'confirmada' }, { where: { id: reservaId } });

    const nuevoComprobante = await Comprobante.create({
        numero: `RES-${Date.now()}`,
        fechaEmision: new Date(),
        tipo: 'reserva',
        reservaId: reservaId
    });

    return { pago: nuevoPago, comprobante: nuevoComprobante };
};

pagoService.obtenerPagos = async () => {
    return await Pago.findAll({ include: [{ model: Reserva, as: 'reserva' }] });
};

pagoService.obtenerPagoPorId = async (id) => {
    const pago = await Pago.findByPk(id, { include: [{ model: Reserva, as: 'reserva' }] });
    if (!pago) throw crearError('Pago no encontrado', 404);
    return pago;
};

pagoService.crearPagoManual = async (data) => {
    return await Pago.create(data);
};

pagoService.actualizarPago = async (id, data) => {
    const actualizado = await Pago.update(data, { where: { id } });
    if (actualizado[0] === 0) throw crearError('Pago no encontrado o no hubo cambios', 404);
    return true;
};

pagoService.eliminarPago = async (id) => {
    const eliminado = await Pago.destroy({ where: { id } });
    if (!eliminado) throw crearError('Pago no encontrado', 404);
    return true;
};

module.exports = pagoService;