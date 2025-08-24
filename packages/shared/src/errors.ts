export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: "Invalid request parameters",
  [ErrorCode.NOT_FOUND]: "Resource not found",
  [ErrorCode.UNAUTHORIZED]: "You must be logged in",
  [ErrorCode.FORBIDDEN]: "You do not have access to this resource",
  [ErrorCode.INTERNAL_ERROR]: "Something went wrong. Please try again later",
};
