const { Op } = require("sequelize");
const Auditoria = require("../models/auditoria.model");

const auditoriaService = {};

auditoriaService.registrarCreate = async (req, datos) => {
    try {
        const {
            accion,
            modelo,
            resultado,
            entidadId = null,
            detalleError = null
        } = datos;

        await Auditoria.create({
            usuarioId: req.usuarioLogged.dataValues.id,
            correoElectronico: req.usuarioLogged.dataValues.correoElectronico,
            rol: req.usuarioLogged.rol,
            ultimoAcceso: req.usuarioLogged.dataValues.ultimoAcceso,
            accion,
            modelo,
            entidadId,
            metodo: req.method,
            ruta: req.originalUrl,
            ip: req.ip,
            resultado,
            detalle: req.body,
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
    return await Auditoria.findAll({ where });
};



module.exports = auditoriaService