const { preference, payment } = require('../../config/mercado-pago.config');

const mercadoPagoService = {};

mercadoPagoService.createPreference = async ({ paquete, cantidad, reservaId }) => {
  const frontendUrl = 'https://proyfrontendgrupo01-6r0q.onrender.com' || process.env.FRONTEND_URL;
  const backendUrl = 'https://proybackendgrupo01-ecl4.onrender.com/api/v1' || process.env.BACKEND_URL;

  const pref = await preference.create({
    body: {
      items: [{
        id: String(paquete.id),
        title: paquete.nombre,
        quantity: cantidad,
        unit_price: Number(paquete.precioBase),
        currency_id: 'ARS',
      }],
      external_reference: String(reservaId),
      back_urls: {
        success: 'https://proyfrontendgrupo01-6r0q.onrender.com/pago/exitoso',
        failure: 'https://proyfrontendgrupo01-6r0q.onrender.com/pago/rechazado',
        pending: 'https://proyfrontendgrupo01-6r0q.onrender.com/pago/pendiente'
      },
      auto_return: 'approved',
      notification_url: 'https://proybackendgrupo01-ecl4.onrender.com/api/v1/pagos/webhook',
    },
  });

  return pref;
};

mercadoPagoService.getPayment = async (paymentId) => {
  return await payment.get({ id: paymentId });
};

module.exports = mercadoPagoService;