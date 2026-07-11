const { Op } = require("sequelize");
const Auditoria = require("../models/auditoria.model");
const { now } = require("sequelize/lib/utils");

const auditoriaService = {};

auditoriaService.registrarCreate = async (req, datos, usuario = null) => {
    try {
        const {
            accion,
            modelo,
            resultado,
            entidadId = null,
            detalleError = null
        } = datos;

        const usuarioAuditoria = usuario || req.usuarioLogged;

        await Auditoria.create({
            usuarioId: usuarioAuditoria?.id ?? null,
            correoElectronico: usuarioAuditoria?.correoElectronico ?? null,
            rol: usuarioAuditoria?.rol ?? null,
            ultimoAcceso: usuarioAuditoria?.ultimoAcceso ?? null,
            accion,
            modelo,
            entidadId,
            metodo: req.method,
            ruta: req.originalUrl,
            ip: req.ip,
            resultado,
            detalle: JSON.stringify(req.body),
            detalleError
        });
    } catch (error) {
        console.error(error);
    }
};

auditoriaService.buscarAuditorias = async (filtros) => {
    const where = {};
    if (filtros.usuarioId) {
        where.usuarioId = filtros.usuarioId;
    }
    if (filtros.accion) {
        where.accion = filtros.accion;
    }
    if (filtros.rol) {
        where.rol = filtros.rol;
    }
    if (filtros.metodo) {
        where.metodo = filtros.metodo;
    }
    if (filtros.modelo) {
        where.modelo = filtros.modelo;
    }
    if (filtros.resultado) {
        where.resultado = filtros.resultado;
    }

    let fechaDesde = null;
    let fechaHasta = null;

    if (filtros.fechaDesde) {
        fechaDesde = new Date(filtros.fechaDesde);
        fechaDesde.setHours(0, 0, 0, 0);
    }
    if (filtros.fechaHasta) {
        fechaHasta = new Date(filtros.fechaHasta);
        fechaHasta.setHours(23, 59, 59, 999);
    }
    if (fechaDesde && fechaHasta) {
        where.createdAt = {
            [Op.between]: [fechaDesde, fechaHasta]
        };
    } else if (fechaDesde) {
        where.createdAt = {
            [Op.gte]: fechaDesde
        };
    } else if (fechaHasta) {
        where.createdAt = {
            [Op.lte]: fechaHasta
        };
    }
    return await Auditoria.findAll({
        where,
        order: [
            ['createdAt', 'DESC'],
            ['id', 'DESC']
        ]
    });
};

auditoriaService.getFiltros = async () => {
    const filtros = {
        accion: [
            'Login',
            'Consultar',
            'Crear',
            'Modificar',
            'Eliminar',
            'Exportar',
            'Pagar',
            'Cancelar',
            'Confirmar',
            'SignUp',
            'Descargar'
        ],
        resultado: [
            'OK',
            'Error'
        ],
        modelo: [
            'Usuario',
            'Paquete Turistico',
            'Vacante',
            'Reserva',
            'Perfil de Usuario',
            'Empleado',
            'Cliente',
            'Dashboard',
            'Comprobante',
            'Pago'
        ],
        rol: [
            'Cliente',
            'Recepcionista',
            'Gerente'
        ],
    }
    return filtros
}


module.exports = auditoriaService