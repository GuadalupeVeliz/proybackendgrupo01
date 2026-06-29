const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Reserva = require('./reserva.model');

const Comprobante = sequelize.define('Comprobante', {
    numero: { type: DataTypes.STRING, allowNull: false },
    fechaEmision: { type: DataTypes.DATE, allowNull: false },
    tipo: { type: DataTypes.ENUM('reserva', 'cancelacion'), allowNull: false },
}, {
    tableName: 'Comprobantes', // Nombre de la tabla en minúsculas y plural
    timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
})
Comprobante.belongsTo(Reserva, { foreignKey: 'reservaId', as: 'reserva' });
module.exports = Comprobante;