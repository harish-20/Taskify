export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  DIFFERENT_PROVIDER_ACCOUNT = "DIFFERENT_PROVIDER_ACCOUNT",
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: "Invalid request parameters",
  [ErrorCode.NOT_FOUND]: "Resource not found",
  [ErrorCode.UNAUTHORIZED]: "You must be logged in",
  [ErrorCode.FORBIDDEN]: "You do not have access to this resource",
  [ErrorCode.INTERNAL_ERROR]: "Something went wrong. Please try again later",
  [ErrorCode.EMAIL_ALREADY_EXISTS]: "Email is already registered",
  [ErrorCode.DIFFERENT_PROVIDER_ACCOUNT]:
    "This email is registered with a different provider",
};
