const express = require('express');
const cors = require('cors');

const CLIENT_PORT = process.env.CLIENT_PORT || 4200;
const CLIENT_HOST = process.env.CLIENT_HOST || 'localhost'

const app = express();

app.use(express.json());
app.use(cors({ origin: `http://${CLIENT_HOST}:${CLIENT_PORT}` }));

module.exports = app;