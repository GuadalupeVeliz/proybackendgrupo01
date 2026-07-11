const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "API Turismo del Norte'",
    description:
      "Documentación de la API para el sistema de gestión de reservas turísticas Turismo del Norte..\n" +
      "Integrantes del grupo:\n" +
      "- Barboza, Nicolás Gonzalo\n" +
      "- Lamas, Juan Eduardo\n" +
      "- Véliz, Guadalupe Virginia",
    version: "1.0.0",
  },
  host: "proybackendgrupo01-ecl4.onrender.com",
  basePath: "/",
  schemes: ["https", "http"],
  tags: [
    { name: "Auth", description: "Login, registro y autenticación con Google" },
    {
      name: "Usuarios",
      description: "Gestión de usuarios, clientes y empleados",
    },
    {
      name: "Paquetes Turísticos",
      description: "Gestión de paquetes turísticos y sus vacantes",
    },
    {
      name: "Vacantes",
      description: "Gestión de cupos disponibles por salida",
    },
    { name: "Reservas", description: "Creación y gestión de reservas" },
    { name: "Pagos", description: "Registro y gestión de pagos de reservas" },
    {
      name: "Comprobantes",
      description: "Emisión de comprobantes de reserva/cancelación",
    },
    {
      name: "Dashboard",
      description: "Métricas, gráficos y exportación de reportes",
    },
  ],
  definitions: {
    Usuario: {
      id: 1,
      correoElectronico: "guada@example.com",
      ultimoAcceso: "2026-07-09T14:30:00.000Z",
      eliminado: false,
      googleId: null,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-07-09T14:30:00.000Z",
    },
    createUsuario: {
      correoElectronico: "guada@example.com",
      clave: "MiPassword123!",
      activo: true,
      // campos para usuario empleado
      legajo: "JP001",
      sede: "sucursal",
      esGerente: false,
      // campos para usuario cliente
      dni: "11111111",
      nombreCompleto: "Guadalupe Veliz",
      telefono: "3881111111",
    },
    updateUsuario: {
      correoElectronico: "guada.nuevo@example.com",
      clave: "NuevaPassword456!",
    },
    Cliente: {
      id: 1,
      usuarioId: 1,
      dni: "30123456",
      nombreCompleto: "Guadalupe Veliz",
      telefono: "3884123456",
      eliminado: false,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
    },
    createCliente: {
      usuarioId: 1,
      dni: "30123456",
      nombreCompleto: "Guadalupe Veliz",
      telefono: "3884123456",
    },
    updateCliente: {
      nombreCompleto: "Guadalupe Virginia Veliz ",
      telefono: "3884987654",
      dni: "30123999",
    },
    Empleado: {
      id: 1,
      usuarioId: 2,
      legajo: "EMP-001",
      sede: "central",
      esGerente: false,
      eliminado: false,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
    },
    createEmpleado: {
      usuarioId: 2,
      legajo: "EMP-001",
      sede: "central",
      esGerente: false,
    },
    updateEmpleado: {
      legajo: "EMP-003",
      sede: "sucursal",
      esGerente: true,
    },
    PaqueteTuristico: {
      id: 1,
      nombre: "Escapada a la Puna",
      ubicacion: "Jujuy, Argentina",
      descripcion: "Recorrido de 3 días por salinas y pueblos andinos",
      precioBase: 45000.0,
      duracionEnDias: "3",
      imagen: "puna.jpg",
      estado: "disponible",
      eliminado: false,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
    },
    createPaqueteTuristico: {
      nombre: "Escapada a la Puna",
      ubicacion: "Jujuy, Argentina",
      descripcion: "Recorrido de 3 días por salinas y pueblos andinos",
      precioBase: 45000.0,
      duracionEnDias: "3",
      imagen: "puna.jpg",
    },
    updatePaqueteTuristico: {
      nombre: "Escapada a la Puna - Editado",
      ubicacion: "Jujuy",
      descripcion: "Recorrido de 7 días por salinas y pueblos andinos",
      precioBase: 50000.0,
      duracionEnDias: "7",
      estado: "no_disponible",
      imagen: "puna3.jpg",
    },
    Reserva: {
      id: 1,
      clienteId: 1,
      vacanteId: 1,
      fechaDeReservacion: "2026-07-20",
      cantidadDePersonas: 2,
      montoPagado: 20000.0,
      estado: "confirmada",
      eliminado: false,
      createdAt: "2026-07-09T14:30:00.000Z",
      updatedAt: "2026-07-09T14:30:00.000Z",
    },
    createReserva: {
      clienteId: 1,
      vacanteId: 1,
      fechaDeReservacion: "2026-07-20",
      cantidadDePersonas: 2,
    },
    updateReserva: {
      clienteId: 1,
      vacanteId: 1,
      cantidadDePersonas: 3,
      fechaDeReservacion: "2026-08-15",
    },
    Pago: {
      id: 1,
      reservaId: 1,
      fecha: "2026-07-09T14:30:00.000Z",
      monto: 20000.0,
      metodoPago: "TARJETA_CREDITO",
      estado: "pagado",
      eliminado: false,
      createdAt: "2026-07-09T14:30:00.000Z",
      updatedAt: "2026-07-09T14:30:00.000Z",
    },
    createPago: {
      reservaId: 2,
      monto: 20000.0,
      metodoPago: "TARJETA_CREDITO",
    },
    updatePago: {
      monto: 25000.0,
      metodoPago: "TRANSFERENCIA",
    },
    Comprobante: {
      id: 1,
      reservaId: 1,
      numero: "COMP-2026-0001",
      fechaDeEmision: "2026-07-09T14:30:00.000Z",
      tipo: "reserva",
      eliminado: false,
      createdAt: "2026-07-09T14:30:00.000Z",
      updatedAt: "2026-07-09T14:30:00.000Z",
    },
    createComprobante: {
      numero: "COMP-2026-0001",
      fechaDeEmision: "2026-07-09T14:30:00.000Z",
      tipo: "reserva",
      reservaId: 1,
    },
    updateComprobante: {
      numero: "COMP-2026-0001-REV",
      tipo: "cancelacion",
    },
    Vacante: {
      id: 1,
      paqueteTuristicoId: 1,
      fechaDeSalida: "2026-08-15",
      cupoTotal: 20,
      cupoDisponible: 12,
      estado: "disponible",
      eliminado: false,
      createdAt: "2026-01-15T10:00:00.000Z",
      updatedAt: "2026-01-15T10:00:00.000Z",
    },
    createVacante: {
      paqueteTuristicoId: 1,
      fechaDeSalida: "2026-08-15",
      cupoTotal: 20,
    },
    updateVacante: {
      cupoTotal: 8,
      fechaDeSalida: "2026-08-15",
      estado: "no_disponible",
    },
    googleAuthCredential: {
      credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6...", // ID token de Google
    },

    // Respuesta de /signup
    googleSignupResponse: {
      tempToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      email: "guada@example.com",
      name: "Guadalupe Veliz",
      picture: "https://lh3.googleusercontent.com/a/foto.jpg",
    },

    // Respuesta de /signin
    googleSigninResponse: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      correo: "guada@example.com",
      rol: "Cliente",
      clienteId: 1,
      empleadoId: null,
    },
  },
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Documentación generada en ${outputFile}`);
});