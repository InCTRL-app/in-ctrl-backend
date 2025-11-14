import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { getDb } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const app = new Hono<{ Bindings: { DB_BINDING: D1Database } }>();

app.use('*', clerkMiddleware());

app.get('/', async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    });
  }

  const db = getDb(c.env.DB_BINDING);

  const user = await db.select().from(users).where(eq(users.clerkId, auth.userId)).get();

  return c.json({
    message: 'You are logged in!',
    userId: auth.userId,
    user: user,
  });
});

export default app;
