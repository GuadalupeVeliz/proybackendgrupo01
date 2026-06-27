const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "API Turismo del Norte'",
    description: "Documentación de la API para el sistema de gestión de reservas turísticas Turismo del Norte.",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  tags: [] ,
  definitions: {},
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"];
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log(`Documentación generada en ${outputFile}`);
});