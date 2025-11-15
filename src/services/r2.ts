import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Creates an S3 client configured for Cloudflare R2
 */
function createR2Client(env: CloudflareBindings): S3Client {
  const accessKeyId = env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  const accountId = env.R2_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID;

  if (!accessKeyId || !secretAccessKey || !accountId) {
    throw new Error(
      'R2 credentials not configured. Please set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ACCOUNT_ID in your environment variables.',
    );
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Get the bucket name from environment
 * This is defined in CloudflareBindings (from wrangler.jsonc)
 */
function getBucketName(env: CloudflareBindings): string {
  return env.R2_BUCKET_NAME;
}

/**
 * Generate a presigned download URL for an R2 object
 * This is the main helper function that can be used by any endpoint
 * that needs to generate a download URL from a stored key.
 *
 * @param env - Environment variables containing R2 credentials
 * @param key - The R2 object key (e.g., "userId/timestamp-filename.jpg")
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL and expiration timestamp
 */
export async function generatePresignedDownloadUrl(
  env: CloudflareBindings,
  key: string,
  expiresIn: number = 3600,
): Promise<{ url: string; expires: number }> {
  const s3Client = createR2Client(env);
  const bucketName = getBucketName(env);

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn,
  });

  return {
    url,
    expires: Math.floor(Date.now() / 1000) + expiresIn,
  };
}

/**
 * Generate a presigned upload URL for R2
 *
 * @param env - Environment variables containing R2 credentials
 * @param key - The R2 object key where the file will be uploaded
 * @param contentType - MIME type of the file (default: "application/octet-stream")
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL and expiration timestamp
 */
export async function generatePresignedUploadUrl(
  env: CloudflareBindings,
  key: string,
  contentType: string = 'application/octet-stream',
  expiresIn: number = 3600,
): Promise<{ url: string; expires: number }> {
  const s3Client = createR2Client(env);
  const bucketName = getBucketName(env);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn,
  });

  return {
    url,
    expires: Math.floor(Date.now() / 1000) + expiresIn,
  };
}

