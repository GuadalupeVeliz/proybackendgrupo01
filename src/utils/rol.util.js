const getRol = (usuario) => {
  if (usuario.empleado) {
    return usuario.empleado.esGerente ? 'Gerente' : 'Recepcionista';
  }
  return 'Cliente';
};

module.exports = getRol;
