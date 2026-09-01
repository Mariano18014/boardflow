import multer, { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../lib/errors";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
});

export function uploadSingleFile(fieldName: string) {
  const middleware = upload.single(fieldName);
  return function handleSingleFileUpload(req: Request, res: Response, next: NextFunction) {
    middleware(req, res, (error: unknown) => {
      if (error instanceof MulterError) {
        return next(new ValidationError({ [fieldName]: ["El archivo es demasiado grande."] }));
      }
      if (error) {
        return next(error);
      }
      next();
    });
  };
}
