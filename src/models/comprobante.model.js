const { DataTypes, DATE } = require('sequelize');
const sequelize = require('../../config/database.config');

const Comprobante = sequelize.define(
  'Comprobante',
  {
    numero: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El número de comprobante no puede estar vacío.' },
      },
    },
    fechaDeEmision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM,
      values: ['reserva', 'cancelacion'],
      defaultValue: 'reserva',
      allowNull: false,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'comprobantes',
    timestamps: true,
  },
);

module.exports = Comprobante;
