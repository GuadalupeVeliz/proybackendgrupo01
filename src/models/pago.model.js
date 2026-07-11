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
      values: ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'MERCADO_PAGO'],
      allowNull: false,
    },
    mpPaymentId: {
      type: DataTypes.STRING,
      unique: true
    },
    mpPreferenceId: {
      type: DataTypes.STRING
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['pagado', 'pendiente', 'cancelado', 'rechazado'],
      defaultValue: 'pendiente',
      allowNull: false,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'pagos'
  },
);

module.exports = Pago;
