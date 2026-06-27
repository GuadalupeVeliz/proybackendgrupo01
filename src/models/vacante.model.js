const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');
const PaqueteTuristico = require('./paqueteTuristico.model');

const Vacante = sequelize.define('Vacante', {
    fechaSalida: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    sucursal: {
        type: DataTypes.ENUM(
            'SAN_SALVADOR',
            'PURMAMARCA',
            'TILCARA'
        ),
        allowNull: false
    },
    cupoTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cupoDisponible: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'vacantes',
    timestamps: true
});

Vacante.belongsTo(PaqueteTuristico, {
    as: 'paquete',
    foreignKey: 'paqueteId'
});

PaqueteTuristico.hasMany(Vacante, {
    as: 'vacantes',
    foreignKey: 'paqueteId'
});

module.exports = Vacante;