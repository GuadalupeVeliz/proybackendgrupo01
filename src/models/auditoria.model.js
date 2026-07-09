const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database.config");

const Auditoria = sequelize.define('Auditoria', {
    usuarioId: {
        type: DataTypes.INTEGER
    },
    correoElectronico: {
        type:DataTypes.STRING
    },
    rol: {
        type:DataTypes.STRING,
    },
    ultimoAcceso: {
        type:DataTypes.DATE
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    entidadId: {
        type: DataTypes.INTEGER
    },
    metodo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ruta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING
    },
    resultado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detalle: {
        type: DataTypes.TEXT
    }
},
    {
        tableName: 'auditorias',
        timestamps: true
    }
);

module.exports = Auditoria