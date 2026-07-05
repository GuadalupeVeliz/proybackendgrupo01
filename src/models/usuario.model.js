const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const Usuario = sequelize.define(
  'Usuario',
  {
    correoElectronico: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: 'El correo electrónico debe tener un formato válido.',
        },
      },
      allowNull: false,
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ultimoAcceso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
  },
);

module.exports = Usuario;
