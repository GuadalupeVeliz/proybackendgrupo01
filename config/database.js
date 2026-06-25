const { Sequelize } = require('sequelize');

const bd_nombre = "tpfinalweb"
const bd_contrasena = process.env.DB_PASS || 'postgres'

const sequelize = new Sequelize(bd_nombre, 'postgres', bd_contrasena,
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

sequelize.authenticate()
    .then(() => console.log('BD esta conectado a PostgreSQL'))
    .catch(error => console.log('Error al conectar a PostgreSQL:', error));

module.exports = sequelize;