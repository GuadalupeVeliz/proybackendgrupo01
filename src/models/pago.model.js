const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Reserva = require('./reserva.model');

const Pago = sequelize.define('Pago', {
    fecha: { type: DataTypes.DATE, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    metodoPago: { type: DataTypes.STRING, allowNull: false },
    estado: { type: DataTypes.ENUM('pagado', 'pendiente'), allowNull: false }
}, {
    tableName: 'Pagos', // Nombre de la tabla en minúsculas y plural
    timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
})
Pago.belongsTo(Reserva, { foreignKey: 'reservaId', as: 'reserva' });
module.exports = Pago;