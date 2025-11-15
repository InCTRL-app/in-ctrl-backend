import { OpenAPIHono } from '@hono/zod-openapi';
import {
  generatePresignedDownloadUrl,
  generatePresignedUploadUrl,
} from '../services/r2';
import {
  uploadPresignedRoute,
  downloadPresignedRoute,
} from './media.routes';

const media = new OpenAPIHono<{
  Bindings: CloudflareBindings;
  Variables: {
    userId: string;
  };
}>();

/**
 * Generate presigned upload URL for R2
 * POST /media/upload/presigned
 */

media.openapi(uploadPresignedRoute, async (c) => {
  // Get validated request body
  const { filename, contentType } = c.req.valid('json');

  // Get userId from context (set by auth middleware)
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401 as const);
  }

  // Generate a unique key for the file
  const key = `${userId}/${Date.now()}-${filename}`;

  try {
    // Generate presigned upload URL using helper function
    const { url, expires } = await generatePresignedUploadUrl(
      c.env,
      key,
      contentType,
    );

    return c.json({
      url,
      key,
      expires,
    } as const, 200 as const);
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate presigned URL',
      } as const,
      500 as const,
    );
  }
});

/**
 * Generate presigned download URL for R2
 * GET /media/download/presigned?key=...
 */
media.openapi(downloadPresignedRoute, async (c) => {
  // Get validated query parameters
  const { key } = c.req.valid('query');

  // Get userId from context (set by auth middleware)
  const userId = c.get('userId');
  if (!userId || !key.startsWith(`${userId}/`)) {
    return c.json({ error: 'Unauthorized' }, 401 as const);
  }

  try {
    // Generate presigned download URL using helper function
    const { url, expires } = await generatePresignedDownloadUrl(c.env, key);

    return c.json({
      url,
      key,
      expires,
    } as const, 200 as const);
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate presigned URL',
      } as const,
      500 as const,
    );
  }
});

export default media;

