const { DataTypes } = require('sequelize');
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
    fechaEmision: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM,
      values: ['reserva', 'cancelacion', 'reembolso'],
      defaultValue: 'reserva',
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'comprobantes',
    timestamps: true,
  }
);

module.exports = Comprobante;
