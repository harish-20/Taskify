import { ErrorCode, ErrorMessages } from "@repo/shared/errors";
import { AuthProvider } from "../models/user.model.js";

export class CustomError extends Error {
  statusCode: number = 500;
  errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR;

  constructor(message: string = ErrorMessages[ErrorCode.INTERNAL_ERROR]) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidArgument extends CustomError {
  errors: string[] = [];
  constructor(
    message: string = ErrorMessages[ErrorCode.VALIDATION_ERROR],
    errors: string[] = []
  ) {
    super(message);
    this.statusCode = 400;
    this.errorCode = ErrorCode.VALIDATION_ERROR;
    this.errors = errors;
  }
}

export class NotFound extends CustomError {
  constructor(message: string = ErrorMessages[ErrorCode.NOT_FOUND]) {
    super(message);
    this.statusCode = 404;
    this.errorCode = ErrorCode.NOT_FOUND;
  }
}

export class AccountNotExists extends CustomError {
  statusCode = 404;
  errorCode = ErrorCode.ACCOUNT_NOT_EXISTS;
  constructor(message = ErrorMessages[ErrorCode.ACCOUNT_NOT_EXISTS]) {
    super(message);
  }
}

export class EmailAlreadyExists extends CustomError {
  statusCode = 400;
  errorCode = ErrorCode.EMAIL_ALREADY_EXISTS;
  constructor(message = ErrorMessages[ErrorCode.EMAIL_ALREADY_EXISTS]) {
    super(message);
  }
}

export class DifferentProviderAccount extends CustomError {
  statusCode = 400;
  errorCode = ErrorCode.DIFFERENT_PROVIDER_ACCOUNT;
  linkedProvider: AuthProvider | undefined;
  constructor(
    message = ErrorMessages[ErrorCode.DIFFERENT_PROVIDER_ACCOUNT],
    linkedProvider: AuthProvider
  ) {
    super(message);
    this.linkedProvider = linkedProvider;
  }
}

export class InvalidPassword extends CustomError {
  statusCode = 401;
  errorCode = ErrorCode.INVALID_PASSWORD;
  constructor(message = ErrorMessages[ErrorCode.INVALID_PASSWORD]) {
    super(message);
  }
}
