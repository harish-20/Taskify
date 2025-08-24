import { ErrorCode } from "@repo/shared/errors";
import logger from "../utils/logger.js";

import { Request, Response, NextFunction } from "express";

import { CustomError } from "../utils/CustomError.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    logger.error(err.message, { errorCode: err.errorCode });

    return res.status(err.statusCode).json({
      success: false,
      code: err.errorCode,
      message: err.message,
    });
  }

  logger.error("Unexpected error", err);
  res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_ERROR,
    message: "Unexpected server error",
  });
};
