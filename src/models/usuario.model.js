const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Cliente = require('./cliente.model');
const Empleado = require('./empleado.model');

const Usuario = sequelize.define(
    'Usuario',
    {
        correoElectronico: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
            },
            allowNull: false,
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        ultimoAcceso: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'usuarios',
        timestamps: true,
    }
);

Usuario.hasOne(Cliente, {
    foreignKey: 'usuarioId',
    as: 'cliente',
});

Usuario.hasOne(Empleado, {
    foreignKey: 'usuarioId',
    as: 'empleado',
});

module.exports = Usuario;
