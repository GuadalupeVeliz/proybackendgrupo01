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
          msg: 'El nombre del paquete turístico no puede estar vacío.',
        },
      },
    },
    destino: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El destino no puede estar vacío.' },
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isPositive(value) {
          if (value === null || value === undefined || parseFloat(value) <= 0) {
            throw new Error('El precio del paquete debe ser mayor a cero.');
          }
        },
      },
    },
    duracionDias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'La duración mínima es de 1 día.',
        },
      },
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM,
      values: ['activo', 'inactivo'],
      defaultValue: 'activo',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: 'paquetes_turisticos',
    timestamps: true,
    hooks: {
      beforeUpdate: async (paquete) => {
        const isTransitioningToInactiveStatus =
          paquete.changed('estado') && paquete.estado === 'inactivo';
        const isPerformingSoftDelete =
          paquete.changed('activo') && paquete.activo === false;

        if (isTransitioningToInactiveStatus || isPerformingSoftDelete) {
          const activeVacancyWithBookings =
            await sequelize.models.Vacante.findOne({
              where: {
                paqueteTuristicoId: paquete.id,
                activo: true,
                cupoDisponible: {
                  [sequelize.Sequelize.Op.lt]:
                    sequelize.Sequelize.col('cupoTotal'),
                },
              },
            });

          if (activeVacancyWithBookings) {
            throw new Error(
              'No se puede desactivar el paquete turístico porque existen vacantes asociadas con reservas activas.'
            );
          }
        }
      },
    },
  }
);

module.exports = PaqueteTuristico;
