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
      type: DataTypes.INTEGER,
      values: [3, 7],
      defaultValue: 3,
      allowNull: false,
      validate: {
        isIn: {
          args: [[3, 7]],
          msg: 'La duración debe ser 3 o 7 días.',
        },
      },
    },
    imagenes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        notEmpty(value) {
          if (!value || value.length === 0) {
            throw new Error('Debe proporcionar al menos una imagen.');
          }
        },
      },
    },
    incluye: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    noIncluye: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    hotel: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    puntoDeSalida: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El punto de salida no puede estar vacío.',
        },
      },
    },

    recomendaciones: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    dificultad: {
      type: DataTypes.ENUM,
      values: ['baja', 'media', 'alta'],
      defaultValue: 'baja',
      allowNull: false,
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
