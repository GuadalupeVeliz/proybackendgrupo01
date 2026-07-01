const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Comprobante = require('./comprobante.model');
const Pago = require('./pago.model');
const Vacante = require('./vacante.model');
const Cliente = require('./cliente.model');

const Reserva = sequelize.define(
    'Reserva',
    {
        fechaReservacion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        cantidadPersonas: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM,
            values: ['pendiente', 'confirmada', 'cancelada'],
            defaultValue: 'pendiente',
            allowNull: false,
        },
        montoPagado: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'reservas',
        timestamps: true,
    }
);

Reserva.hasOne(Comprobante, {
    foreignKey: 'reservaId',
    as: 'comprobante',
});

Reserva.hasOne(Pago, {
    foreignKey: 'reservaId',
    as: 'pago',
});

Reserva.belongsTo(Vacante, {
    foreignKey: 'vacanteId',
    as: 'vacante',
});

Reserva.belongsTo(Cliente, {
    foreignKey: 'clienteId',
    as: 'cliente',
});

module.exports = Reserva;
