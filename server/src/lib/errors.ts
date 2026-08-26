export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

export class ValidationError extends HttpError {
  fieldErrors: Record<string, string[] | undefined>;

  constructor(fieldErrors: Record<string, string[] | undefined>) {
    super(400, "Validation failed");
    this.fieldErrors = fieldErrors;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}
