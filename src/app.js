const express = require('express');
const cors = require('cors');
const empleadoRoutes = require('./routes/empleado.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const clienteRoutes = require('./routes/cliente.routes');
const authRoutes = require('./routes/auth.routes');

const CLIENT_PORT = process.env.CLIENT_PORT || 4200;
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost';

const app = express();

app.use(express.json());
app.use(cors({ origin: `http://${CLIENT_HOST}:${CLIENT_PORT}` }));

app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/empleados', empleadoRoutes);
app.use('/api/v1/clientes', clienteRoutes);
app.use('/api/v1/auth', authRoutes);

module.exports = app;
