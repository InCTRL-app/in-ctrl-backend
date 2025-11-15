import { createRoute } from '@hono/zod-openapi';
import {
  generateUploadUrlSchema,
  generateDownloadUrlSchema,
  presignedUrlResponseSchema,
  errorResponseSchema,
} from './media.schemas';

/**
 * Route definition for generating presigned upload URL
 */
export const uploadPresignedRoute = createRoute({
  method: 'post',
  path: '/upload/presigned',
  summary: 'Generate presigned upload URL',
  description: 'Generates a presigned URL for uploading a file to R2 storage',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: generateUploadUrlSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Presigned upload URL generated successfully',
      content: {
        'application/json': {
          schema: presignedUrlResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

/**
 * Route definition for generating presigned download URL
 */
export const downloadPresignedRoute = createRoute({
  method: 'get',
  path: '/download/presigned',
  summary: 'Generate presigned download URL',
  description: 'Generates a presigned URL for downloading a file from R2 storage',
  security: [{ bearerAuth: [] }],
  request: {
    query: generateDownloadUrlSchema,
  },
  responses: {
    200: {
      description: 'Presigned download URL generated successfully',
      content: {
        'application/json': {
          schema: presignedUrlResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

