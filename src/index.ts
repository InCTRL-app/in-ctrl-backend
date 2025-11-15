import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import mediaRoutes from './routes/media';
import { openAPIConfig } from './config/openapi';

const app = new OpenAPIHono<{
  Bindings: CloudflareBindings;
  Variables: {
    userId: string;
  };
}>();

// OpenAPI documentation endpoints (no auth required)
app.doc('/openapi.json', openAPIConfig);
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// Apply Clerk middleware
app.use('*', clerkMiddleware());

// Require authentication for all routes - rejects unauthenticated requests
app.use('*', async (c, next) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  // Set userId in context for use in routes
  c.set('userId', auth.userId);
  await next();
});

// Health check / root endpoint
app.get('/', async (c) => {
  const userId = c.get('userId')!;

  return c.json({
    message: 'You are logged in!',
    userId: userId,
  });
});

// Mount media routes
app.route('/media', mediaRoutes);

export default app;
