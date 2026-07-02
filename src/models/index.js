const Cliente = require('./cliente.model');
const Comprobante = require('./comprobante.model');
const Empleado = require('./empleado.model');
const Pago = require('./pago.model');
const PaqueteTuristico = require('./paquete-turistico.model');
const Reserva = require('./reserva.model');
const Usuario = require('./usuario.model');
const Vacante = require('./vacante.model');

Usuario.hasOne(Cliente, {
  foreignKey: 'usuarioId',
  as: 'cliente',
});
Cliente.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

Usuario.hasOne(Empleado, {
  foreignKey: 'usuarioId',
  as: 'empleado',
});
Empleado.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

PaqueteTuristico.hasMany(Vacante, {
  foreignKey: 'paqueteTuristicoId',
  as: 'vacantes',
});
Vacante.belongsTo(PaqueteTuristico, {
  foreignKey: 'paqueteTuristicoId',
  as: 'paqueteTuristico',
});

Cliente.hasMany(Reserva, {
  foreignKey: 'clienteId',
  as: 'reservas',
});
Reserva.belongsTo(Cliente, {
  foreignKey: 'clienteId',
  as: 'cliente',
});

Vacante.hasMany(Reserva, {
  foreignKey: 'vacanteId',
  as: 'reservas',
});
Reserva.belongsTo(Vacante, {
  foreignKey: 'vacanteId',
  as: 'vacante',
});

Reserva.hasOne(Comprobante, {
  foreignKey: 'reservaId',
  as: 'comprobante',
});
Comprobante.belongsTo(Reserva, {
  foreignKey: 'reservaId',
  as: 'reserva',
});

Reserva.hasOne(Pago, {
  foreignKey: 'reservaId',
  as: 'pago',
});
Pago.belongsTo(Reserva, {
  foreignKey: 'reservaId',
  as: 'reserva',
});

module.exports = {
  Cliente,
  Comprobante,
  Empleado,
  Pago,
  PaqueteTuristico,
  Reserva,
  Usuario,
  Vacante,
};
