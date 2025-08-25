import { ErrorCode } from "@repo/shared/errors";
import logger from "../utils/logger.js";

import { ErrorRequestHandler } from "express";

import { CustomError, InvalidArgument } from "../utils/CustomError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof CustomError) {
    logger.error(err.message, { errorCode: err.errorCode });

    return res.status(err.statusCode).json({
      success: false,
      code: err.errorCode,
      message: err.message,
      ...(err instanceof InvalidArgument ? { errors: err.errors } : {}),
    });
  }

  logger.error("Unexpected error", err);
  res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    message: "Unexpected server error",
  });
};
