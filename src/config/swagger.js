import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { appUrl, port } from "./loadEnv.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KnowledgeHub API Documentation",
      version: "1.0.0",
      description: "RESTful API documentation for the KnowledgeHub Question & Answer platform",
    },
    servers: [
      {
        url: appUrl || `http://localhost:${port}`,
        description: "Development Server",
      },
      {
        url: "/",
        description: "Current Domain / Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
