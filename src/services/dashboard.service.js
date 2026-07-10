const { getChartImageBuffer } = require('../utils/chartImage');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { fn, col, Op } = require("sequelize");
const {
  Reserva,
  Pago,
  Vacante,
  Cliente,
  Usuario,
  PaqueteTuristico,
} = require("../models");
const dashboardService = {};

const NOMBRES_MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const contarReservasPorEstado = () =>
  Reserva.findAll({
    attributes: ["estado", [fn("COUNT", col("id")), "cantidad"]],
    group: ["estado"],
  });

dashboardService.getResumen = async () => {
  const [totalReservas, porEstado, ingresos, paqueteMasVendido] =
    await Promise.all([
      Reserva.count(),
      contarReservasPorEstado(),
      Pago.findOne({
        attributes: [[fn("SUM", col("monto")), "total"]],
        where: { estado: "pagado" },
      }),
      Reserva.findAll({
        attributes: [[fn("COUNT", col("Reserva.id")), "cantidad"]],
        include: [
          {
            model: Vacante,
            as: "vacante",
            attributes: [],
            include: [
              {
                model: PaqueteTuristico,
                as: "paqueteTuristico",
                attributes: ["id", "nombre"],
              },
            ],
          },
        ],
        group: [
          "vacante.paqueteTuristico.id",
          "vacante.paqueteTuristico.nombre",
        ],
        order: [[fn("COUNT", col("Reserva.id")), "DESC"]],
        limit: 1,
        subQuery: false,
        raw: true,
      }),
    ]);

  return {
    totalReservas,
    reservasPorEstado: porEstado,
    ingresosTotales: ingresos?.dataValues?.total ?? 0,
    paqueteMasVendido:
      paqueteMasVendido[0]?.["vacante.paqueteTuristico.nombre"] ?? null,
  };
};

dashboardService.getReservasPorMes = async (anio) => {
  const resultado = await Reserva.findAll({
    attributes: [
      [fn("TO_CHAR", col("fechaDeReservacion"), "MM"), "mes"],
      [fn("COUNT", col("id")), "cantidad"],
    ],
    where: {
      fechaDeReservacion: {
        [Op.between]: [new Date(`${anio}-01-01`), new Date(`${anio}-12-31`)],
      },
    },
    group: [fn("TO_CHAR", col("fechaDeReservacion"), "MM")],
    order: [[fn("TO_CHAR", col("fechaDeReservacion"), "MM"), "ASC"]],
  });

  return resultado;
};

dashboardService.getReservasPorEstado = async () => {
  const resultado = await Reserva.findAll({
    attributes: ["estado", [fn("COUNT", col("id")), "cantidad"]],
    group: ["estado"],
  });

  return resultado;
};

dashboardService.getIngresosEvolucion = async (desde, hasta) => {
  const where = { estado: "pagado" };

  if (desde && hasta) {
    where.fecha = { [Op.between]: [new Date(desde), new Date(hasta)] };
  }

  const resultado = await Pago.findAll({
    attributes: [
      [fn("TO_CHAR", col("fecha"), "YYYY-MM"), "mes"],
      [fn("SUM", col("monto")), "total"],
    ],
    where,
    group: [fn("TO_CHAR", col("fecha"), "YYYY-MM")],
    order: [[fn("TO_CHAR", col("fecha"), "YYYY-MM"), "ASC"]],
  });

  return resultado;
};

dashboardService.getReservas = async ({ estado, search, page, limit }) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (estado) where.estado = estado.toLowerCase();

  const include = [
    {
      model: Cliente,
      as: "cliente",
      attributes: ["nombreCompleto", "dni", "telefono"],
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["correoElectronico"],
        },
      ],
    },
    {
      model: Vacante,
      as: "vacante",
      include: [
        {
          model: PaqueteTuristico,
          as: "paqueteTuristico",
          attributes: ["nombre", "ubicacion"],
        },
      ],
    },
  ];

  if (search) {
    const searchTerm = search.trim();
    include[0].where = {
      [Op.or]: [
        { nombreCompleto: { [Op.iLike]: `%${searchTerm}%` } },
        { dni: { [Op.iLike]: `%${searchTerm}%` } },
      ],
    };
    include[0].required = true;
  }

  const { count, rows } = await Reserva.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["fechaDeReservacion", "DESC"]],
    distinct: true,
  });

  return {
    total: count,
    pagina: count === 0 ? 0 : parseInt(page),
    totalPaginas: Math.ceil(count / limit),
    reservas: rows,
  };
};

dashboardService.generarPDF = async (anio = new Date().getFullYear()) => {
  const { totalReservas, reservasPorEstado, ingresosTotales } =
    await dashboardService.getResumen();
  const reservasPorMes = await dashboardService.getReservasPorMes(anio);
  const ingresosEvolucion = await dashboardService.getIngresosEvolucion();

  const chartBar = await getChartImageBuffer({
    type: 'bar',
    data: {
      labels: reservasPorMes.map(r => NOMBRES_MES[parseInt(r.dataValues.mes, 10) - 1]),
      datasets: [{
        label: 'Reservas',
        data: reservasPorMes.map(r => Number(r.dataValues.cantidad)),
        backgroundColor: '#C1652F',
      }],
    },
    options: { plugins: { legend: { display: false } } },
  });

  const chartPie = await getChartImageBuffer({
    type: 'pie',
    data: {
      labels: reservasPorEstado.map(r => r.dataValues.estado),
      datasets: [{ data: reservasPorEstado.map(r => Number(r.dataValues.cantidad)) }],
    },
  });

  const chartLine = await getChartImageBuffer({
    type: 'line',
    data: {
      labels: ingresosEvolucion.map(i => i.dataValues.mes),
      datasets: [{
        label: 'Ingresos',
        data: ingresosEvolucion.map(i => Number(i.dataValues.total)),
        borderColor: '#2E5339',
      }],
    },
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Reporte Dashboard - Turismo del Norte', { align: 'center' });
    doc.moveDown();
    doc.fontSize(13).text(`Total de reservas: ${totalReservas}`);
    doc.text(`Ingresos totales: $${ingresosTotales}`);
    doc.moveDown();

    doc.fontSize(13).text('Reservas por mes:');
    doc.image(chartBar, { fit: [500, 300], align: 'center' });

    doc.addPage();
    doc.fontSize(13).text('Reservas por estado:');
    doc.image(chartPie, { fit: [400, 300], align: 'center' });
    doc.moveDown();

    doc.fontSize(13).text('Evolución de ingresos:');
    doc.image(chartLine, { fit: [500, 300], align: 'center' });

    doc.end();
  });
};

dashboardService.generarExcel = async (anio = new Date().getFullYear()) => {
  const { totalReservas, reservasPorEstado, ingresosTotales } =
    await dashboardService.getResumen();
  const reservasPorMes = await dashboardService.getReservasPorMes(anio);
  const ingresosEvolucion = await dashboardService.getIngresosEvolucion();

  const chartBar = await getChartImageBuffer({
    type: 'bar',
    data: {
      labels: reservasPorMes.map(r => NOMBRES_MES[parseInt(r.dataValues.mes, 10) - 1]),
      datasets: [{
        label: 'Reservas',
        data: reservasPorMes.map(r => Number(r.dataValues.cantidad)),
        backgroundColor: '#C1652F',
      }],
    },
    options: { plugins: { legend: { display: false } } },
  });

  const chartPie = await getChartImageBuffer({
    type: 'pie',
    data: {
      labels: reservasPorEstado.map(r => r.dataValues.estado),
      datasets: [{ data: reservasPorEstado.map(r => Number(r.dataValues.cantidad)) }],
    },
  });

  const chartLine = await getChartImageBuffer({
    type: 'line',
    data: {
      labels: ingresosEvolucion.map(i => i.dataValues.mes),
      datasets: [{
        label: 'Ingresos',
        data: ingresosEvolucion.map(i => Number(i.dataValues.total)),
        borderColor: '#2E5339',
      }],
    },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Turismo del Norte';
  workbook.created = new Date();
  const TERRACOTA = 'FFC1652F';
  const estiloHeader = (row) => {
    row.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: TERRACOTA },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  };

  const tituloSeccion = (sheet, texto, celda) => {
    const cell = sheet.getCell(celda);
    cell.value = texto;
    cell.font = { bold: true, size: 13, color: { argb: TERRACOTA } };
  };
  const generalSheet = workbook.addWorksheet('Dashboard General');
  generalSheet.columns = [
    { width: 18 }, { width: 15 }, { width: 4 },
    { width: 15 }, { width: 12 }, { width: 4 },
    { width: 12 }, { width: 12 },
  ];
  tituloSeccion(generalSheet, 'Resumen', 'A1');
  generalSheet.getRow(2).values = ['Indicador', 'Valor'];
  estiloHeader(generalSheet.getRow(2));
  generalSheet.addRow(['Total de reservas', totalReservas]);
  generalSheet.addRow(['Ingresos totales', `$${ingresosTotales}`]);

  tituloSeccion(generalSheet, 'Reservas por mes', 'A7');
  generalSheet.getRow(8).values = ['Mes', 'Cantidad'];
  estiloHeader(generalSheet.getRow(8));
  reservasPorMes.forEach(r => {
    generalSheet.addRow([
      NOMBRES_MES[parseInt(r.dataValues.mes, 10) - 1],
      Number(r.dataValues.cantidad),
    ]);
  });

  const chartBarId = workbook.addImage({ buffer: chartBar, extension: 'png' });
  generalSheet.addImage(chartBarId, {
    tl: { col: 2.5, row: 6 },
    ext: { width: 480, height: 280 },
  });

  const filaInicioEstado = 8 + reservasPorMes.length + 4;
  tituloSeccion(generalSheet, 'Reservas por estado', `A${filaInicioEstado}`);
  generalSheet.getRow(filaInicioEstado + 1).values = ['Estado', 'Cantidad'];
  estiloHeader(generalSheet.getRow(filaInicioEstado + 1));
  reservasPorEstado.forEach(r => {
    generalSheet.addRow([r.dataValues.estado, Number(r.dataValues.cantidad)]);
  });

  const chartPieId = workbook.addImage({ buffer: chartPie, extension: 'png' });
  generalSheet.addImage(chartPieId, {
    tl: { col: 2.5, row: filaInicioEstado - 1 },
    ext: { width: 420, height: 280 },
  });

  const ingresosSheet = workbook.addWorksheet('Evolución de ingresos');
  ingresosSheet.columns = [
    { width: 15 }, { width: 15 }, { width: 4 },
  ];

  tituloSeccion(ingresosSheet, 'Evolución de ingresos', 'A1');
  ingresosSheet.getRow(2).values = ['Mes', 'Total'];
  estiloHeader(ingresosSheet.getRow(2));
  ingresosEvolucion.forEach(i => {
    ingresosSheet.addRow([i.dataValues.mes, Number(i.dataValues.total)]);
  });

  const chartLineId = workbook.addImage({ buffer: chartLine, extension: 'png' });
  ingresosSheet.addImage(chartLineId, {
    tl: { col: 3, row: 1 },
    ext: { width: 550, height: 320 },
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = dashboardService;
