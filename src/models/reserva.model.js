const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const Reserva = sequelize.define(
  'Reserva',
  {
    fechaReservacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfter: {
          args: [new Date().toISOString().split('T')[0]],
          msg: 'La fecha de reservación debe ser posterior a la fecha actual.',
        },
      },
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    cantidadPersonas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'La reserva debe ser como mínimo para 1 persona.',
        },
      },
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['pendiente', 'confirmada', 'cancelada'],
      defaultValue: 'pendiente',
      allowNull: false,
    },
    montoPagado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isPositive(value) {
          if (value != null && parseFloat(value) < 0) {
            throw new Error('El monto pagado no puede ser negativo.');
          }
        },
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'reservas',
    timestamps: true,
  }
);

module.exports = Reserva;
