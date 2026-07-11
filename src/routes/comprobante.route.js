const express = require("express");
const comprobanteController = require("../controllers/comprobante.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const comprobanteRoutes = express.Router();

comprobanteRoutes.use(authMiddleware.verifyUserToken);

comprobanteRoutes.get(
  "/me",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Obtener mis comprobantes'
    #swagger.description = 'Devuelve el historial de comprobantes del cliente autenticado'
    #swagger.responses[200] = {
    description: 'Comprobantes obtenidos correctamente',
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener tu historial'
    }
  */
  authMiddleware.authorizeByRole(["Cliente"]),
  comprobanteController.getMyComprobantes,
);
comprobanteRoutes.get(
  "/cliente/:clienteId",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Obtener comprobantes por cliente'
    #swagger.description = 'Devuelve todos los comprobantes activos asociados a un cliente'
    #swagger.parameters['clienteId'] = { description: 'ID del cliente', type: 'integer' }
    #swagger.responses[200] = {
      description: 'Comprobantes obtenidos correctamente',
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener los comprobantes'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista"]),
  comprobanteController.getComprobantesByClienteId,
);
comprobanteRoutes.get(
  "/:id/download-pdf",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Descargar comprobante en PDF'
    #swagger.description = 'Genera y descarga el archivo PDF del comprobante solicitado'
    #swagger.parameters['id'] = { 
      description: 'ID del comprobante', 
      type: 'integer'
    }
    #swagger.responses[200] = { 
      description: 'Archivo PDF generado correctamente'
    }
    #swagger.responses[500] = { 
      description: 'Error al generar el documento PDF'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista", "Cliente"]),
  comprobanteController.downloadComprobantePDF,
);

comprobanteRoutes.get(
  "/",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Obtener todos los comprobantes'
    #swagger.description = 'Devuelve la lista de comprobantes activos ordenados por fecha de creación descendente'
    #swagger.responses[200] = {
      description: 'Comprobantes obtenidos correctamente',
    }
    #swagger.responses[500] = { 
      description: 'Error al obtener los comprobantes'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista"]),
  comprobanteController.getComprobantes,
);
comprobanteRoutes.post(
  "/",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Crear comprobante'
    #swagger.description = 'Crea un nuevo comprobante manualmente'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { 
        { $ref: '#/definitions/createComprobante' }
      }
    }
    #swagger.responses[201] = {
      description: 'Comprobante creado correctamente'
    }
    #swagger.responses[400] = { 
      description: 'Error al crear el comprobante'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista"]),
  comprobanteController.createComprobante,
);
comprobanteRoutes.get(
  "/:id",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Obtener comprobante por ID'
    #swagger.description = 'Devuelve un comprobante activo por su ID, incluyendo su reserva asociada.'
    #swagger.parameters['id'] = { 
      description: 'ID del comprobante', 
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Comprobante encontrado'
    }
    #swagger.responses[404] = { 
      description: 'Comprobante no encontrado'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista"]),
  comprobanteController.getComprobanteById,
);
comprobanteRoutes.put(
  "/:id",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Actualizar comprobante'
    #swagger.description = 'Actualiza los datos de un comprobante existente'
    #swagger.parameters['id'] = { 
      description: 'ID del comprobante', 
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
         {$ref: '#/definitions/createComprobante' }
      }
    }
    #swagger.responses[200] = {
      description: 'Comprobante actualizado exitosamente',
    }
    #swagger.responses[400] = { 
      description: 'Error al actualizar el comprobante'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista"]),
  comprobanteController.updateComprobante,
);
comprobanteRoutes.delete(
  "/:id",
  /*
    #swagger.tags = ['Comprobantes']
    #swagger.summary = 'Eliminar comprobante'
    #swagger.description = 'Elimina lógicamente un comprobante (baja de activo a inactivo)'
    #swagger.parameters['id'] = { 
      description: 'ID del comprobante', 
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Comprobante eliminado exitosamente',
    }
    #swagger.responses[404] = { 
      description: 'Comprobante no encontrado'
    }
  */
  authMiddleware.authorizeByRole(["Gerente", "Recepcionista"]),
  comprobanteController.deleteComprobante,
);

module.exports = comprobanteRoutes;
