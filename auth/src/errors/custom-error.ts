export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  //Format all errors to common response structure
  //     { errors: {message: string, filed?: string}[]}
  abstract serializeErrors(): { message: string; field?: string }[];
}
