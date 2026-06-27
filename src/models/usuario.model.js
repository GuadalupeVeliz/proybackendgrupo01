const { DataTypes } = require('sequelize');
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

module.exports = Usuario;
