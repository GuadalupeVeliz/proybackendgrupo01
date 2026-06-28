const { DataTypes, ENUM } = require('sequelize')

const sequelize = require('../../config/database.config');

const Vacante = require('./vacante.model');
const Cliente = require('./cliente.model');

const Reserva = sequelize.define('Reserva', {

    fechaReservacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.ENUM(
            'pendiente',
            'confirmada',
            'cancelada'
        ),
        allowNull: false, 
        defaultValue: 'pendiente'
    },
    montoPagado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    borrado: {
        type:DataTypes.BOOLEAN,     //true: borrado, false:existe
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'reservas',
    timestamps: true
})

Reserva.belongsTo(Cliente, {
    foreignKey: {
        name: 'clienteId',
        allowNull: false
    },
    as: 'cliente'
})

Reserva.belongsTo(Vacante, {
    foreignKey: {
        name: 'vacanteId',
        allowNull: false
    },
    as: 'vacante'
})

module.exports = Reserva;