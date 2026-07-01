const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Reserva = require('./reserva.model');

const Pago = sequelize.define(
    'Pago',
    {
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        metodoPago: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM,
            values: ['pagado', 'pendiente'],
            defaultValue: 'pendiente',
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'pagos',
        timestamps: true,
    }
);

Pago.belongsTo(Reserva, {
    foreignKey: 'reservaId',
    as: 'reserva',
});

module.exports = Pago;
