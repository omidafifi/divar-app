const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function SwaggerConfig(app) {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Divar API",
        description: "Divar API Documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
    },
    apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
  };

  const swaggerDocument = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = SwaggerConfig;
