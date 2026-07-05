const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

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
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'clientes',
    timestamps: true,
  },
);

module.exports = Cliente;
