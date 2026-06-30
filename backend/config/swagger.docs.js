import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { BaseUrl, ApiUrl } from './config.js';

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Genius Society Hotel API',
      version: '1.0.0',
      description: 'API documentation for the Genius Society Hotel booking system',
    },

    servers: [
      {
        url: BaseUrl,
        description: 'Development server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: ['./routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);


/**
 * Initialize Swagger UI
 * @param {import('express').Application} app
 */
export const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  console.log(
    `[Swagger] Docs available at ${ApiUrl}/api-docs`
  );
};