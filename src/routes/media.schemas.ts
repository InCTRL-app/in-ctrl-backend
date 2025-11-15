import { z } from 'zod';

/**
 * Schema for generating presigned upload URL request body
 */
export const generateUploadUrlSchema = z.object({
  filename: z.string().min(1, 'filename is required'),
  contentType: z.string().optional(),
});

/**
 * Schema for generating presigned download URL query parameters
 */
export const generateDownloadUrlSchema = z.object({
  key: z.string().min(1, 'key query parameter is required'),
});

/**
 * Response schema for presigned URL endpoints
 */
export const presignedUrlResponseSchema = z.object({
  url: z.string().describe('Presigned URL for upload/download'),
  key: z.string().describe('R2 object key'),
  expires: z.number().describe('Unix timestamp when the URL expires'),
});

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
  error: z.string().describe('Error message'),
});

/**
 * Type inference from schemas
 */
export type GenerateUploadUrlRequest = z.infer<typeof generateUploadUrlSchema>;
export type GenerateDownloadUrlQuery = z.infer<typeof generateDownloadUrlSchema>;
export type PresignedUrlResponse = z.infer<typeof presignedUrlResponseSchema>;

