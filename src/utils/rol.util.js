const getRol = (usuario) => {
  if (usuario.empleado) {
    return usuario.empleado.esGerente === true ? 'Gerente' : 'Recepcionista';
  }
  else if (usuario.rol) {
    return usuario.rol === 'Gerente' ? 'Gerente' : 'Recepcionista';
  }
  return 'Cliente';
};

module.exports = getRol;
