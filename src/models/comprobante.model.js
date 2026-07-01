const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Reserva = require('./reserva.model');

const Comprobante = sequelize.define(
    'Comprobante',
    {
        numero: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fechaEmision: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.ENUM,
            values: ['reserva', 'cancelacion'],
            defaultValue: 'reserva',
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'comprobantes',
        timestamps: true,
    }
);

Comprobante.belongsTo(Reserva, {
    foreignKey: 'reservaId',
    as: 'reserva',
});

module.exports = Comprobante;
