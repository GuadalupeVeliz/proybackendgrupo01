const paqueteTuristicoService = require('../services/paquete-turistico.service');
const auditoriaService = require("../services/auditoria.service");
const storageService = require('../services/supabase-storage.service');

const paqueteTuristicoController = {};

const parsearArreglo = (valor, campo) => {
  if (Array.isArray(valor)) return valor;
  if (valor == null || valor === '') return [];
  try {
    const resultado = JSON.parse(valor);
    if (!Array.isArray(resultado)) throw new Error();
    return resultado;
  } catch {
    throw new Error(`El campo ${campo} debe ser un arreglo JSON válido.`);
  }
};

const normalizarBody = (body) => {
  const resultado = { ...body };
  if (body.precioBase != null) resultado.precioBase = Number(body.precioBase);
  if (body.duracionEnDias != null) resultado.duracionEnDias = Number(body.duracionEnDias);
  for (const campo of ['incluye', 'noIncluye', 'recomendaciones']) {
    if (body[campo] != null) resultado[campo] = parsearArreglo(body[campo], campo);
  }
  delete resultado.imagenes;
  return resultado;
};

paqueteTuristicoController.createPaqueteTuristico = async (req, res) => {
  try {
    if (!req.files?.length) throw new Error('Debe seleccionar al menos una imagen.');
    const imagenesSubidas = await storageService.subirImagenes(req.files);
    let paqueteTuristico;
    try {
      paqueteTuristico = await paqueteTuristicoService.addPaqueteTuristico({
        ...normalizarBody(req.body),
        imagenes: imagenesSubidas.map(({ url }) => url),
      });
    } catch (error) {
      await storageService.eliminarImagenes(imagenesSubidas.map(({ ruta }) => ruta)).catch(() => undefined);
      throw error;
    }
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: paqueteTuristico.id,
        });
    return res.status(201).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Crear', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(400).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.getPaquetesTuristicos = async (req, res) => {
  try {
    const paquetesTuristicos = await paqueteTuristicoService.findPaquetesTuristicos(req.query.lang);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
        });
    return res.status(200).json({ success: true, data: paquetesTuristicos });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          detalleError:error.message
        });
    return res.status(500).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.getPaqueteTuristicoById = async (req, res) => {
  try {
    const paqueteTuristico = await paqueteTuristicoService.findPaqueteTuristicoById(req.params.id,req.query.lang);
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Consultar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.updatePaqueteTuristico = async (req, res) => {
  let imagenesNuevas = [];
  try {
    const paqueteActual = await paqueteTuristicoService.findPaqueteTuristicoById(req.params.id);
    const updates = normalizarBody(req.body);
    if (req.files?.length) {
      imagenesNuevas = await storageService.subirImagenes(req.files);
      updates.imagenes = imagenesNuevas.map(({ url }) => url);
    }
    const paqueteTuristico = await paqueteTuristicoService.editPaqueteTuristico(
      req.params.id,
      updates
    );
    if (imagenesNuevas.length) {
      await storageService.eliminarImagenes(paqueteActual.imagenes).catch(() => undefined);
    }
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(200).json({ success: true, data: paqueteTuristico });
  } catch (error) {
    if (imagenesNuevas.length) {
      await storageService.eliminarImagenes(imagenesNuevas.map(({ ruta }) => ruta)).catch(() => undefined);
    }
    await auditoriaService.registrarCreate(req,{
          accion: 'Modificar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

paqueteTuristicoController.deletePaqueteTuristico = async (req, res) => {
  try {
    await paqueteTuristicoService.deletePaqueteTuristico(req.params.id);
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Paquete Turistico',
          resultado: 'OK',
          entidadId: req.params.id,
        });
    return res.status(204).send();
  } catch (error) {
    await auditoriaService.registrarCreate(req,{
          accion: 'Eliminar', 
          modelo: 'Paquete Turistico',
          resultado: 'Error',
          entidadId: req.params.id,
          detalleError:error.message
        });
    return res.status(404).json({ success: false, error: error.message });
  }
};

module.exports = paqueteTuristicoController;
