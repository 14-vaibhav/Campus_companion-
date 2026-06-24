const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Campus Companion API',
      version: '1.0.0',
      description: 'API documentation for Campus Companion backend endpoints.'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: <token>'
        },
        roleHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-role',
          description: 'Fallback role header (e.g. admin)'
        },
        authHeaderSecret: {
          type: 'apiKey',
          in: 'header',
          name: 'authorization',
          description: 'Bearer <admin_secret> fallback authorization'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
