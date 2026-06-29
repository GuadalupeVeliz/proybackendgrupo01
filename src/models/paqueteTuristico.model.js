const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.config');

const PaqueteTuristico = sequelize.define('PaqueteTuristico', {
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  destino: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  detalles: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duracionDias: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo'),
    defaultValue: 'activo'
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = PaqueteTuristico;