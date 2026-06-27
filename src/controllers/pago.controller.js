const Pago = require('../models/pago.model'); 
const Reserva = require('../models/reserva.model');
const Comprobante = require('../models/comprobante.model'); 
const mercadopagoService = require('../services/mercadopago.service');
const conversorService = require('../services/conversor.service');
const pagoCtrl = {};

// ==========================================
// RUTAS DE INTEGRACIÓN CON MERCADO PAGO
// ==========================================

pagoCtrl.iniciarPago = async (req, res) => {
    try {
        const { reservaId, monto, monedaPaquete, tituloPaquete } = req.body;
        
        // Convertimos el monto a ARS
        const montoFinalARS = await conversorService.convertirAMonedaLocal(monto, monedaPaquete || 'ARS');

        if (!montoFinalARS) {
            return res.status(500).json({ msg: 'Error al calcular la conversión de moneda' });
        }

        const tituloParaMP = tituloPaquete || "Paquete Turístico Turismo del Norte"; 

        const initPoint = await mercadopagoService.crearPreferencia(tituloParaMP, montoFinalARS, reservaId);

        if (!initPoint) {
            return res.status(500).json({ msg: 'Error al comunicarse con Mercado Pago' });
        }

        res.status(200).json({ linkDePago: initPoint });

    } catch (error) {
        console.error("Error en iniciarPago:", error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

pagoCtrl.confirmarPago = async (req, res) => {
    try {
        const { payment_id } = req.body;

        const datosPago = await mercadopagoService.consultarPago(payment_id);

        if (!datosPago || datosPago.status !== 'approved') {
            return res.status(400).json({ msg: 'El pago no está aprobado o no existe' });
        }

        const reservaId = datosPago.external_reference;

        // 1. Creamos el registro del Pago
        const nuevoPago = await Pago.create({
            fecha: new Date(datosPago.date_approved),
            monto: datosPago.transaction_amount,
            metodoPago: datosPago.payment_method_id,
            estado: 'pagado',
            reservaId: reservaId
        });

        // 2. Actualizamos el estado de la reserva a 'confirmada'
        await Reserva.update(
            { estado: 'confirmada' }, 
            { where: { id: reservaId } }
        );

        // 3. <-- GENERACIÓN AUTOMÁTICA DEL COMPROBANTE DE RESERVA
        const nuevoComprobante = await Comprobante.create({
            numero: `RES-${Date.now()}`, // Usamos un timestamp para garantizar un número de ticket único
            fechaEmision: new Date(),
            tipo: 'reserva',
            reservaId: reservaId
        });

        // 4. Respondemos con todo el paquete de información
        res.status(200).json({ 
            msg: 'Pago guardado, reserva confirmada y comprobante generado exitosamente',
            pago: nuevoPago,
            comprobante: nuevoComprobante
        });

    } catch (error) {
        console.error("Error en confirmarPago:", error);
        res.status(500).json({ msg: 'Error interno al procesar el pago' });
    }
};

// ==========================================
// RUTAS CRUD ESTÁNDAR
// ==========================================

pagoCtrl.getPagos = async (req, res) => {
    try {
        const pagos = await Pago.findAll({
            include: [{
                model: Reserva,
                as: 'reserva'
            }]
        });
        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(500).json({ msg: 'Error al listar los pagos' });
    }
};

pagoCtrl.getPago = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await Pago.findByPk(id, {
            include: [{ model: Reserva, as: 'reserva' }]
        });

        if (!pago) {
            return res.status(404).json({ msg: 'Pago no encontrado' });
        }
        res.status(200).json(pago);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el pago' });
    }
};

pagoCtrl.createPago = async (req, res) => {
    try {
        const nuevoPago = await Pago.create(req.body);
        res.status(201).json({ 
            msg: 'Pago creado exitosamente (Operación manual)', 
            pago: nuevoPago 
        });
    } catch (error) {
        console.error("Error al crear pago manualmente:", error);
        res.status(500).json({ msg: 'Error al crear el pago' });
    }
};

pagoCtrl.updatePago = async (req, res) => {
    try {
        const { id } = req.params;
        // update() en Sequelize devuelve un array donde la posición 0 es la cantidad de filas afectadas
        const actualizado = await Pago.update(req.body, { where: { id } });
        
        if (actualizado[0] === 0) {
            return res.status(404).json({ msg: 'Pago no encontrado o no hubo cambios' });
        }
        
        res.status(200).json({ msg: 'Pago actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar pago:", error);
        res.status(500).json({ msg: 'Error al actualizar el pago' });
    }
};

pagoCtrl.deletePago = async (req, res) => {
    try {
        const { id } = req.params;
        // destroy() devuelve la cantidad de filas eliminadas
        const eliminado = await Pago.destroy({ where: { id } });
        
        if (!eliminado) {
            return res.status(404).json({ msg: 'Pago no encontrado' });
        }
        
        res.status(200).json({ msg: 'Pago eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar pago:", error);
        res.status(500).json({ msg: 'Error al eliminar el pago' });
    }
};

module.exports = pagoCtrl;