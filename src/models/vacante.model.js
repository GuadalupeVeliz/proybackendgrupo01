const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const Vacante = sequelize.define(
  'Vacante',
  {
    fechaDeSalida: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isAfter: {
          args: [new Date().toISOString().split('T')[0]],
          msg: 'La fecha de salida debe ser posterior a la fecha actual.',
        },
      },
    },
    cupoTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'El cupo total debe ser como mínimo 1.',
        },
      },
    },
    cupoDisponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El cupo disponible no puede ser negativo.' },
        isLessThanTotal(value) {
          if (value > this.cupoTotal) {
            throw new Error('El cupo disponible no puede ser mayor al cupo total.');
          }
        },
      },
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
    tableName: 'vacantes',
    timestamps: true,
    hooks: {
      beforeValidate: async (vacante) => {
        if (vacante.cupoDisponible === undefined || vacante.cupoDisponible == null) {
          vacante.cupoDisponible = vacante.cupoTotal;
        }

        const paqueteTuristico = await sequelize.models.PaqueteTuristico.findByPk(
          vacante.paqueteTuristicoId
        );

        if (
          !paqueteTuristico ||
          paqueteTuristico.estado === 'no_disponible' ||
          paqueteTuristico.eliminado
        ) {
          throw new Error(
            'No se pueden crear vacantes para un paquete turístico no disponible o eliminado.'
          );
        }
      },
    },
  }
);

module.exports = Vacante;
