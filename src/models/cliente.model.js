const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const Cliente = sequelize.define(
    'Cliente',
    {
        dni: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nombreCompleto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'clientes',
        timestamps: true,
    }
);

module.exports = Cliente;
