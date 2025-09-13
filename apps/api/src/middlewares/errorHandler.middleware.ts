import { ApiResponse } from "@repo/shared/types";
import { ErrorCode } from "@repo/shared/errors";

import logger from "../utils/logger.js";
import { sendResponse } from "../utils/response.js";

import { ErrorRequestHandler } from "express";

import { CustomError, InvalidArgument } from "../utils/CustomError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof CustomError) {
    logger.error(`Programatic error [${err.errorCode}] - ${err.message}\n`, {
      path: req.originalUrl,
      method: req.method,
      statusCode: err.statusCode,
      stack: err.stack,
    });

    const payload: ApiResponse = {
      success: false,
      code: err.errorCode,
      message: err.message,
      ...(err instanceof InvalidArgument ? { errors: err.errors } : {}),
    };
    return sendResponse(res, err.statusCode, payload);
  }

  logger.error("Unexpected error", {
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
    error: err.message ?? err,
  });

  const payload: ApiResponse = {
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    message: "Unexpected server error",
  };
  return sendResponse(res, 500, payload);
};
