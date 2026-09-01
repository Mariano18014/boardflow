import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { env } from "../config/env";
import { ValidationError } from "../lib/errors";

const UPLOADS_ROOT_DIR = path.resolve(process.cwd(), "uploads");

export type StorableFile = {
  originalName: string;
  buffer: Buffer;
};

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export function validateImageFile(file: Express.Multer.File, fieldName: string): void {
  checkImageFileType(file, fieldName);
  checkImageFileSize(file, fieldName);
}

function checkImageFileType(file: Express.Multer.File, fieldName: string): void {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    throw new ValidationError({ [fieldName]: ["El archivo debe ser JPG, PNG o SVG."] });
  }
}

function checkImageFileSize(file: Express.Multer.File, fieldName: string): void {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ValidationError({ [fieldName]: ["El archivo no puede superar los 2MB."] });
  }
}

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
