const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Reserva = require('./reserva.model');
const Usuario = require('./usuario.model');

const Cliente = sequelize.define(
    'Cliente',
    {
        dni: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        nombreCompleto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'clientes',
        timestamps: true,
    }
);

Cliente.hasMany(Reserva, {
    foreignKey: 'clienteId',
    as: 'reservas',
});

Cliente.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
});

module.exports = Cliente;
