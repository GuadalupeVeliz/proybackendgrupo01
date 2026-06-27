const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');

var app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.use('/api/pagos', require('./src/routes/pago.route.js'));

app.set('port', process.env.PORT || 3000);


sequelize.sync({ force: false })
    .then(() => {
        console.log('Tablas de PostgreSQL Sincronizadas')
        app.listen(app.get('port'), () => { console.log('Server iniciado en puerto', app.get('port')) });
    })
    .catch(error => console.error('No se pudo iniciar el servidor debido a un error en la BD:', error));