/**Purpose:

Keeps Swagger configuration separate from your app.js or routes.
Centralizes all API documentation settings in one place.
Makes it easy to import and use in app.js.
Clean architecture: configuration files vs server logic vs route logic.

Think of it like a “settings panel” for Swagger. */

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {   // <-- must be 'definition', not swaggerDefinition
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Authentication system API documentation",
    },
  },
  apis: ["./src/routes/*.js"], // <-- path to your route files with JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerDocs };



/**const swaggerSpec = swaggerJSDoc(options);
swaggerJSDoc() is a function from swagger-jsdoc.
It reads your code comments (JSDoc in route files) and converts them into a Swagger/OpenAPI specification object.
swaggerSpec is essentially a JSON object describing all your APIs:

Example:

{
  "openapi": "3.0.0",
  "info": { "title": "Node.js Auth API", "version": "1.0.0" },
  "paths": {
    "/loginUser": {
      "post": {
        "summary": "Login user and get tokens",
        "requestBody": { ... },
        "responses": { ... }
      }
    }
  }
}

This JSON object is exactly what Swagger UI uses to render interactive docs. */


/**Why we pass options to swaggerJSDoc
const options = {
  definition: { ... },
  apis: ['./src/routes/*.js']
};
definition: High-level API info, e.g., OpenAPI version, title, server URL.
apis: File path(s) where JSDoc comments exist. Swagger reads these to build paths automatically.

Without options:

Swagger wouldn’t know what your API looks like
Or where to find the documentation comments

Think of options as the map + blueprint for Swagger. */



/** Why we export only swaggerUi and swaggerSpec
export { swaggerUi, swaggerSpec };
swaggerUi → The middleware to serve Swagger docs in your app (/api-docs).
swaggerSpec → The JSON object that contains all your API definitions.

We don’t need anything else in this file because:

swaggerUi is used to mount the UI route in app.js.
swaggerSpec is passed to swaggerUi.setup() to render interactive docs.

Example in app.js:

import { swaggerUi, swaggerSpec } from './config/swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

Only these two are needed to integrate Swagger with Express. */