const sequelize = require('./config/database.config');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

//carga del swagger
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

//ruta a la documentacion de swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

sequelize
    .sync({ force: true })
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
