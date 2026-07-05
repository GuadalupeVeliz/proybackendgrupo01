const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config.js');

const PaqueteTuristico = sequelize.define(
  'PaqueteTuristico',
  {
    nombre: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío.',
        },
      },
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La ubicación no puede estar vacía.' },
      },
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La descripción no pueden estar vacía.' },
      },
    },
    precioBase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value === null || value === undefined || parseFloat(value) <= 0) {
            throw new Error('El costo debe ser mayor a cero.');
          }
        },
      },
    },
    duracionEnDias: {
      type: DataTypes.ENUM,
      values: ['3', '7'],
      defaultValue: '3',
      allowNull: false,
      validate: {
        isIn: {
          args: [['3', '7']],
          msg: 'La duración debe ser 3 o 7 días.',
        },
      },
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['disponible', 'no_disponible'],
      defaultValue: 'disponible',
      allowNull: false,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: 'paquetes_turisticos',
    timestamps: true,
  }
);

module.exports = PaqueteTuristico;
