const PDFDocument = require('pdfkit');

const pdfService = {};

pdfService.buildComprobantePDF = (comprobante, writeStream) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(writeStream);

  doc
    .fontSize(20)
    .text('Turismo del Norte - Comprobante Oficial', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Número de Comprobante: ${comprobante.numero}`);
  doc.text(
    `Fecha de Emisión: ${new Date(comprobante.fechaEmision).toLocaleDateString()}`
  );
  doc.text(`Tipo de Documento: ${comprobante.tipo.toUpperCase()}`);
  doc.moveDown();

  if (comprobante.reserva && comprobante.reserva.cliente) {
    doc.text(`Cliente: ${comprobante.reserva.cliente.nombreCompleto || 'N/D'}`);
    doc.text(`DNI/Pasaporte: ${comprobante.reserva.cliente.dni || 'N/D'}`);
  }
  doc.moveDown();

  if (
    comprobante.reserva &&
    comprobante.reserva.vacante &&
    comprobante.reserva.vacante.paqueteTuristico
  ) {
    doc.text(
      `Paquete Turístico: ${comprobante.reserva.vacante.paqueteTuristico.nombre}`
    );
    doc.text(
      `Destino: ${comprobante.reserva.vacante.paqueteTuristico.destino}`
    );
    doc.text(`Plazas Reservadas: ${comprobante.reserva.cantidadPersonas}`);
  }

  doc.text(
    `Estado del Trámite: ${comprobante.reserva ? comprobante.reserva.estado.toUpperCase() : 'N/D'}`
  );

  doc.end();
};

module.exports = pdfService;
