// server/s3.ts
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET = process.env.AWS_S3_BUCKET!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function randomHex(len = 10) {
  return crypto.randomBytes(len).toString("hex");
}

/**
 * Create a presigned PUT URL for browser direct upload to S3
 * folder: EXACT folder prefix (e.g., 'upload/music' or 'upload/photo')
 * filename: original filename (for extension)
 * contentType: file.type
 */
export async function createPresignedPut({
  folder,
  filename,
  contentType,
}: {
  folder: string;
  filename?: string;
  contentType: string;
}) {
  const safeFolder = folder.replace(/^\/+|\/+$/g, "");
  const ext = filename ? "." + filename.split(".").pop() : "";
  const key = `${safeFolder}/${randomHex(12)}${ext}`; // e.g. upload/music/abc123def456.mp3

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: "public-read", // Objects are publicly readable
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 minutes
  const fileUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(key)}`;

  return { uploadUrl, fileUrl, key };
}

/**
 * Upload buffer directly from server (for generated files, server-side)
 */
export async function uploadBufferToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(key)}`;
}
