const sequelize = require('./config/database.config');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

sequelize
  // .sync()
  .sync({ alter: true })
  .then(() => {
    console.log('Tablas de PostgreSQL Sincronizadas');
    app.listen(PORT, () => {
      console.log(`Server iniciado en puerto: ${PORT}`);
    });
  })
  .catch((error) =>
    console.error(
      'No se pudo iniciar el servidor debido a un error en la BD:',
      error
    )
  );
