import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";

// Local-disk storage — this VM does not run serverless, so files live under
// ./uploads on the server's own filesystem. Swapping this for a provider like
// S3 or Cloudinary later only requires rewriting this file: no caller outside
// of it needs to change.
const UPLOADS_ROOT_DIR = path.resolve(process.cwd(), "uploads");

export type StorableFile = {
  originalName: string;
  buffer: Buffer;
};

export async function saveFile(subfolder: string, file: StorableFile): Promise<string> {
  const directory = path.join(UPLOADS_ROOT_DIR, subfolder);
  await ensureDirectoryExists(directory);
  const fileName = buildUniqueFileName(file.originalName);
  await fs.writeFile(path.join(directory, fileName), file.buffer);
  return buildPublicUrl(subfolder, fileName);
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const filePath = resolveFilePathFromUrl(fileUrl);
  if (!filePath) {
    return;
  }
  await fs.rm(filePath, { force: true });
}

async function ensureDirectoryExists(directory: string) {
  await fs.mkdir(directory, { recursive: true });
}

function buildUniqueFileName(originalName: string): string {
  const extension = path.extname(originalName).toLowerCase();
  return `${crypto.randomUUID()}${extension}`;
}

function buildPublicUrl(subfolder: string, fileName: string): string {
  return `${env.APP_URL}/uploads/${subfolder}/${fileName}`;
}

function resolveFilePathFromUrl(fileUrl: string): string | null {
  const marker = "/uploads/";
  const markerIndex = fileUrl.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }
  const relativePath = fileUrl.slice(markerIndex + marker.length);
  return path.join(UPLOADS_ROOT_DIR, relativePath);
}
