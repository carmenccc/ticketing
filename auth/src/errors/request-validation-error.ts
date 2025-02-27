import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// Extending the built-in error class
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    // Populate the 'errors' property
    super("Invalid request parameters");

    // JavaScript's built-in error classes bahave strangely when extended
    // This line is just to fix the propotype issue
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if ("path" in error) return { message: error.msg, field: error.path };
      return { message: error.msg };
    });
  }
}
