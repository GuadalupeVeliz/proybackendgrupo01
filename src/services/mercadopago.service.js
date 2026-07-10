const crearPreferencia = async (titulo, precio, reservaId) => {
  const miTokenDePrueba =
    'APP_USR-7210889481423827-062701-dd1658a1e07d713a4cd4cecdd7e0877e-3502534824';

  try {
    const respuesta = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${miTokenDePrueba}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: titulo,
              unit_price: Number(precio),
              quantity: 1,
              currency_id: 'ARS',
            },
          ],
          external_reference: reservaId.toString(),

          back_urls: {
            success: 'http://localhost:4200/pago-exitoso',
            failure: 'http://localhost:4200/pago-fallido',
            pending: 'http://localhost:4200/pago-pendiente',
          },

          // Usamos HTTPS ficticio para pasar la validación de seguridad de la API
          /*back_urls: {
                    success: "https://www.turismodelnorte.com/pago-exitoso",
                    failure: "https://www.turismodelnorte.com/pago-fallido",
                    pending: "https://www.turismodelnorte.com/pago-pendiente"
                },
                auto_return: "approved"*/
        }),
      }
    );

    const data = await respuesta.json();

    console.log('Detalle del error de Mercado Pago:', data);

    return data.init_point;
  } catch (error) {
    console.error('Error al generar la preferencia de Mercado Pago:', error);
    return null;
  }
};

const consultarPago = async (paymentId) => {
  const miTokenDePrueba =
    'APP_USR-7210889481423827-062701-dd1658a1e07d713a4cd4cecdd7e0877e-3502534824';

  try {
    const respuesta = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${miTokenDePrueba}`,
        },
      }
    );

    const data = await respuesta.json();
    return data;
  } catch (error) {
    console.error('Error al consultar el pago en Mercado Pago:', error);
    return null;
  }
};

module.exports = { crearPreferencia, consultarPago };
