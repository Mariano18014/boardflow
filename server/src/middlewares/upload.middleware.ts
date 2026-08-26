import multer, { MulterError } from "multer";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../lib/errors";

// Generous safety cap only — it exists to reject absurdly large request bodies
// before they reach memory. The real business limit (e.g. 2MB for org logos)
// is enforced by the service layer, which can give a field-specific message.
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
