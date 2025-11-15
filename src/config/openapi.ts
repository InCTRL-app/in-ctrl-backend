/**
 * OpenAPI configuration for API documentation
 */
export const openAPIConfig = {
  openapi: '3.0.0' as const,
  info: {
    title: 'InCtrl API',
    version: '1.0.0',
    description: 'API documentation for InCtrl backend',
  },
  servers: [
    {
      url: 'http://localhost:8787',
      description: 'Local development server',
    },
    {
      url: 'https://inctrl.inctrl-app.workers.dev',
      description: 'Production server',
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Clerk session token. You can get this from your Clerk dashboard or by authenticating through your frontend application.',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

