import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MulterError } from "multer";

interface HttpError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: HttpError | ZodError | MulterError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: err.issues.map((e) => ({ path: e.path.join("."), message: e.message })),
    });
  }

  if (err instanceof MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large."
        : err.message || "File upload failed.";
    return res.status(400).json({ message });
  }

  const statusCode = (err as HttpError).statusCode ?? 500;
  const message = err.message || "Something went wrong.";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
}

