const { options } = require("pdfkit");
const { Sequelize } = require("sequelize");

const BD_NOMBRE = process.env.DB_NAME || "tpfinalweb"
const BD_USUARIO = process.env.DB_USER || 'postgres'
const BD_CONTRASEÑA = process.env.DB_PASS || 'postgres'
const BD_HOST = process.env.DB_HOST || 'localhost'
const DB_URL = process.env.DATABASE_URL;

// const sequelize = new Sequelize(DB_URL, {
//   dialect: "postgres",
//   logging: false,
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

const sequelize = new Sequelize(BD_NOMBRE, BD_USUARIO, BD_CONTRASEÑA, {
  host: BD_HOST,
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("BD esta conectado a PostgreSQL"))
  .catch((error) => console.log("Error al conectar a PostgreSQL:", error));

module.exports = sequelize;
