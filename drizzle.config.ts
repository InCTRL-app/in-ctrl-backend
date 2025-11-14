import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    databaseId: 'c42a9617-a923-486a-907f-627dfaaab2fe',
    token: process.env.CLOUDFLARE_API_TOKEN || '',
  },
});

