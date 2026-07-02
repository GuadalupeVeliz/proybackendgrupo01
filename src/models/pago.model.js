const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const Pago = sequelize.define(
  'Pago',
  {
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value === null || value === undefined || parseFloat(value) <= 0) {
            throw new Error('El monto del pago debe ser mayor a cero.');
          }
        },
      },
    },
    metodoPago: {
      type: DataTypes.ENUM,
      values: [
        'EFECTIVO',
        'TARJETA_CREDITO',
        'TARJETA_DEBITO',
        'TRANSFERENCIA',
      ],
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['pagado', 'pendiente'],
      defaultValue: 'pendiente',
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'pagos',
    timestamps: true,
  }
);

module.exports = Pago;
