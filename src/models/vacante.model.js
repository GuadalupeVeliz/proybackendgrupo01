const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const Reserva = require('./reserva.model');
const PaqueteTuristico = require('./paquete-turistico.model');

const Vacante = sequelize.define(
    'Vacante',
    {
        fechaSalida: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        sucursal: {
            type: DataTypes.ENUM,
            values: ['SAN_SALVADOR', 'PURMAMARCA', 'TILCARA'],
            allowNull: false,
        },
        cupoTotal: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cupoDisponible: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        tableName: 'vacantes',
        timestamps: true,
    }
);

Vacante.hasMany(Reserva, {
    foreignKey: 'vacanteId',
    as: 'reservas',
});

Vacante.belongsTo(PaqueteTuristico, {
    foreignKey: 'paqueteTuristicoId',
    as: 'paqueteTuristico',
});

module.exports = Vacante;
