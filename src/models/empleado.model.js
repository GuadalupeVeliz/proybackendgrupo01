const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const Empleado = sequelize.define(
    'Empleado',
    {
        legajo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
    },
    {
        tableName: 'empleados',
        timestamps: true,
    }
);

module.exports = Empleado;
