const cron = require('node-cron');
const reservaService = require('../services/reserva.service');

cron.schedule('0 0 * * *', async () => {
  try {
    console.log("cancelado")
    const cantidad = await reservaService.cancelarReservasVencidas();
  } catch (error) {
    console.error(error);
  }
});