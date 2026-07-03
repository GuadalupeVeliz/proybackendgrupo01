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

const contarReservasPorEstado = () =>
  Reserva.findAll({
    attributes: ["estado", [fn("COUNT", col("id")), "cantidad"]],
    group: ["estado"],
  });

dashboardService.getReservasPorEstado = async () => {
  return contarReservasPorEstado();
};

dashboardService.getResumen = async () => {
  const [totalReservas, porEstado, ingresos, ocupacion] = await Promise.all([
    Reserva.count(),
    contarReservasPorEstado(),
    Pago.findOne({
      attributes: [[fn("SUM", col("monto")), "total"]],
      where: { estado: "pagado" },
    }),
    Vacante.findAll({
      attributes: [
        "sucursal",
        [fn("SUM", col("cupoTotal")), "cupoTotal"],
        [fn("SUM", col("cupoDisponible")), "cupoDisponible"],
      ],
      group: ["sucursal"],
    }),
  ]);

  return {
    totalReservas,
    reservasPorEstado: porEstado,
    ingresosTotales: ingresos?.dataValues?.total ?? 0,
    cuposPorSucursal: ocupacion,
  };
};

dashboardService.getReservasPorMes = async (anio) => {
  const resultado = await Reserva.findAll({
    attributes: [
      [fn("TO_CHAR", col("fechaCreacion"), "MM"), "mes"],
      [fn("COUNT", col("id")), "cantidad"],
    ],
    where: {
      fechaCreacion: {
        [Op.between]: [new Date(`${anio}-01-01`), new Date(`${anio}-12-31`)],
      },
    },
    group: [fn("TO_CHAR", col("fechaCreacion"), "MM")],
    order: [[fn("TO_CHAR", col("fechaCreacion"), "MM"), "ASC"]],
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

  if (estado) where.estado = estado;

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
          attributes: ["nombre", "destino"],
        },
      ],
    },
  ];

  if (search) {
    include[0].where = {
      [Op.or]: [
        { nombreCompleto: { [Op.iLike]: `%${search}%` } },
        { dni: { [Op.iLike]: `%${search}%` } },
      ],
    };
    include[0].required = true;
  }

  const { count, rows } = await Reserva.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["fechaCreacion", "DESC"]],
    distinct: true,
  });

  return {
    total: count,
    pagina: count === 0 ? 0 : parseInt(page),
    totalPaginas: Math.ceil(count / limit),
    reservas: rows,
  };
};

module.exports = dashboardService;
