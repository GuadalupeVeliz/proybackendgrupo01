const express = require('express');
const cors = require('cors');
const passport = require('passport');
const empleadoRoutes = require('./routes/empleado.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const clienteRoutes = require('./routes/cliente.routes');
const paqueteRoutes = require('./routes/paquete.routes');
const vacanteRoutes = require('./routes/vacante.routes');
const reservaRoutes = require('./routes/reserva.routes.js');
const pagoRoutes = require('./routes/pago.route.js');
const comprobanteRoutes = require('./routes/comprobante.route.js');

const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');

const CLIENT_PORT = process.env.CLIENT_PORT || 4200;
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';

require('../config/passport.config');

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cors({ origin: `http://${CLIENT_HOST}:${CLIENT_PORT}` }));

app.use('/api/v1/reservas', reservaRoutes);
app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/empleados', empleadoRoutes);
app.use('/api/v1/clientes', clienteRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/perfiles', perfilRoutes)
app.use('/api/v1/pagos', pagoRoutes);
app.use('/api/v1/comprobantes', comprobanteRoutes);

app.use('/api/v1/paquetes', paqueteRoutes);
app.use('/api/v1/vacantes', vacanteRoutes);


module.exports = app;
