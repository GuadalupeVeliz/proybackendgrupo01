const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config.js');
const Vacante = require('./vacante.model.js');

const PaqueteTuristico = sequelize.define('PaqueteTuristico', {
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    destino: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    detalles: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    duracionDias: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM,
        values: ['activo', 'inactivo'],
        defaultValue: 'activo',
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
});

PaqueteTuristico.hasMany(Vacante, {
    foreignKey: 'paqueteTuristicoId',
    as: 'vacantes',
});

module.exports = PaqueteTuristico;
