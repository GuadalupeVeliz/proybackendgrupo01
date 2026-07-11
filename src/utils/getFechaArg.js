const { toZonedTime, format } = require('date-fns-tz');

const fechaHoyArgentina = {};

fechaHoyArgentina.getFecha = () => {
  return format(
    toZonedTime(new Date(), 'America/Argentina/Buenos_Aires'),
    'yyyy-MM-dd'
  );
};

fechaHoyArgentina.getFechaConHora = () => {
  return format(
    toZonedTime(new Date(), 'America/Argentina/Buenos_Aires'),
    'yyyy-MM-dd HH:mm:ss'
  );
}

module.exports = fechaHoyArgentina;