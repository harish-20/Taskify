import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

import { InvalidArgument } from "../utils/CustomError.js";

export const validateRequest =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.issues.map((issue) => issue.message);
        throw new InvalidArgument("Invalid arguments", errors);
      }
      req.body = result.data;
      return next();
    } catch (err) {
      return next(err);
    }
  };

export const validateQuery =
  (schema: ZodObject) =>
  (
    req: Request<{}, {}, {}, Record<string, any>>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        const errors = result.error.issues.map((issue) => issue.message);
        throw new InvalidArgument("Invalid query parameters", errors);
      }
      req.query = result.data;
      return next();
    } catch (err) {
      return next(err);
    }
  };

export const validateParams =
  (schema: ZodObject) =>
  (req: Request<{ [key: string]: any }>, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      if (!result.success) {
        const errors = result.error.issues.map((issue) => issue.message);
        throw new InvalidArgument("Invalid route parameters", errors);
      }
      req.params = result.data;
      return next();
    } catch (err) {
      return next(err);
    }
  };
