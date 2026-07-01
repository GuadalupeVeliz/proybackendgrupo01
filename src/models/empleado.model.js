const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Usuario = require('./usuario.model');

const Empleado = sequelize.define(
    'Empleado',
    {
        legajo: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        sede: {
            type: DataTypes.ENUM,
            values: ['central', 'sucursal'],
            allowNull: false,
        },
        esGerente: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'empleados',
        timestamps: true,
    }
);

Empleado.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
});

module.exports = Empleado;
