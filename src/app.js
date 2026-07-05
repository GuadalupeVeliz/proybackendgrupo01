const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

const passport = require('passport');
require('../config/passport.config');

const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const clienteRoutes = require('./routes/cliente.routes');
const perfilRoutes = require('./routes/perfil.routes');
const paqueteTuristicoRoutes = require('./routes/paquete-turistico.routes.js');
const vacanteRoutes = require('./routes/vacante.routes');
const reservaRoutes = require('./routes/reserva.routes.js');
const pagoRoutes = require('./routes/pago.route.js');
const comprobanteRoutes = require('./routes/comprobante.route.js');

const CLIENT_PORT = process.env.CLIENT_PORT || 4200;
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(
  cors({
    origin: 'http://172.20.0.3:4200' || `http://${CLIENT_HOST}:${CLIENT_PORT}`,
  })
);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/empleados', empleadoRoutes);
app.use('/api/v1/clientes', clienteRoutes);
app.use('/api/v1/perfiles', perfilRoutes);
app.use('/api/v1/paquetes-turisticos', paqueteTuristicoRoutes);
app.use('/api/v1/vacantes', vacanteRoutes);
app.use('/api/v1/reservas', reservaRoutes);
app.use('/api/v1/pagos', pagoRoutes);
app.use('/api/v1/comprobantes', comprobanteRoutes);

module.exports = app;
