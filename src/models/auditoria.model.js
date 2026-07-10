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
        
    },
    modelo: {
        type: DataTypes.STRING,
        
    },
    entidadId: {
        type: DataTypes.INTEGER
    },
    metodo: {
        type: DataTypes.STRING,
        
    },
    ruta: {
        type: DataTypes.STRING,
        
    },
    ip: {
        type: DataTypes.STRING
    },
    resultado: {
        type: DataTypes.STRING,
        
    },
    detalle: {
        type: DataTypes.TEXT
    },
    detalleError: {
        type:DataTypes.STRING
    }
},
    {
        tableName: 'auditorias',
        timestamps: true
    }
);

module.exports = Auditoria