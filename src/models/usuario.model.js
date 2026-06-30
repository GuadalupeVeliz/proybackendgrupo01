const { DataTypes } = require('sequelize');
const Cliente = require('../models/cliente.model');
const Empleado = require('../models/empleado.model');
const sequelize = require('../../config/database.config');

const Usuario = sequelize.define(
    'Usuario',
    {
        correoElectronico: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fechaCreacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        ultimoAcceso: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'usuarios',
        timestamps: true,
    }
);

Usuario.hasOne(Cliente, { as: 'cliente', foreignKey: 'usuarioId' });
Cliente.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Usuario.hasOne(Empleado, { as: 'empleado', foreignKey: 'usuarioId' });
Empleado.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Usuario;
