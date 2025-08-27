import { ApiResponse } from "@repo/shared/types";
import { ErrorCode } from "@repo/shared/errors";

import logger from "../utils/logger.js";
import { sendResponse } from "../utils/response.js";

import { ErrorRequestHandler } from "express";

import { CustomError, InvalidArgument } from "../utils/CustomError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof CustomError) {
    logger.error(err.message, { errorCode: err.errorCode });

    const payload: ApiResponse = {
      success: false,
      code: err.errorCode,
      message: err.message,
      ...(err instanceof InvalidArgument ? { errors: err.errors } : {}),
    };
    sendResponse(res, err.statusCode, payload);
  }

  logger.error("Unexpected error", err);

  const payload: ApiResponse = {
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    message: "Unexpected server error",
  };
  sendResponse(res, 500, payload);
};
