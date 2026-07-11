const cron = require('node-cron');
const reservaService = require('../services/reserva.service');

cron.schedule('0 0 * * *', async () => {
  try {
    console.log("se ejecuta la tarea programada para cancelar reservas vencidas");
    const cantidad = await reservaService.cancelarReservasVencidas();
  } catch (error) {
    console.error(error);
  }
}, timezone = 'America/Argentina/Buenos_Aires');