const PaqueteTuristico = require('../models/paqueteTuristico.model');

const validarPaquete = (datos) => {
  const errores = [];

  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.push('El nombre es obligatorio');
  }

  if (!datos.destino || datos.destino.trim() === '') {
    errores.push('El destino es obligatorio');
  }

  if (!datos.detalles || datos.detalles.trim() === '') {
    errores.push('Los detalles son obligatorios');
  }

  if (!datos.duracionDias || datos.duracionDias <= 0) {
    errores.push('La duración debe ser mayor a 0');
  }

  if (!datos.precio || datos.precio <= 0) {
    errores.push('El precio debe ser mayor a 0');
  }

  if (datos.estado && !['activo', 'inactivo'].includes(datos.estado)) {
    errores.push('El estado debe ser activo o inactivo');
  }

  return errores;
};

exports.getPaquetes = async (req, res) => {
  try {
    const paquetes = await PaqueteTuristico.findAll();
    res.json(paquetes);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener paquetes turísticos',
      error: error.message
    });
  }
};

exports.getPaquete = async (req, res) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id);

    if (!paquete) {
      return res.status(404).json({
        mensaje: 'Paquete turístico no encontrado'
      });
    }

    res.json(paquete);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener el paquete turístico',
      error: error.message
    });
  }
};

exports.createPaquete = async (req, res) => {
  try {
    const errores = validarPaquete(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const paquete = await PaqueteTuristico.create(req.body);

    res.status(201).json({
      mensaje: 'Paquete turístico creado correctamente',
      paquete
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear el paquete turístico',
      error: error.message
    });
  }
};

exports.updatePaquete = async (req, res) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id);

    if (!paquete) {
      return res.status(404).json({
        mensaje: 'Paquete turístico no encontrado'
      });
    }

    const errores = validarPaquete(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    await paquete.update(req.body);

    res.json({
      mensaje: 'Paquete turístico actualizado correctamente',
      paquete
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar el paquete turístico',
      error: error.message
    });
  }
};

exports.deletePaquete = async (req, res) => {
  try {
    const paquete = await PaqueteTuristico.findByPk(req.params.id);

    if (!paquete) {
      return res.status(404).json({
        mensaje: 'Paquete turístico no encontrado'
      });
    }

    await paquete.update({ estado: 'inactivo' });

    res.json({
      mensaje: 'Paquete turístico dado de baja correctamente',
      paquete
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al dar de baja el paquete turístico',
      error: error.message
    });
  }
};