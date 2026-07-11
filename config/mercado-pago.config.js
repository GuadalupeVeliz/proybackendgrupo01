const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_TEST_ACCESS_TOKEN });

module.exports = {
  preference: new Preference(client),
  payment: new Payment(client),
};