import { ErrorCode, ErrorMessages } from "@repo/shared/errors";

export class CustomError extends Error {
  statusCode: number = 500;
  errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR;

  constructor(message: string = ErrorMessages[ErrorCode.INTERNAL_ERROR]) {
    super(message);
  }
}

export class InvalidArgument extends CustomError {
  constructor(message: string = ErrorMessages[ErrorCode.VALIDATION_ERROR]) {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFound extends CustomError {
  constructor(message: string = ErrorMessages[ErrorCode.NOT_FOUND]) {
    super(message);
    this.statusCode = 404;
  }
}
