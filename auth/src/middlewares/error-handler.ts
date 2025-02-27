import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Detemining the type of error to handle
  // 2. Format all errors to common response structure
  //     { errors: {message: string, filed?: string}[]}
  if (err instanceof RequestValidationError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  if (err instanceof DatabaseConnectionError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(400).send({
    errors: [{ message: "Unknown error" }],
  });
};
