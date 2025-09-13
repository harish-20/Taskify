import { ZodObject } from "zod";
import { InvalidArgument } from "../utils/CustomError.js";
import { NextFunction, Request, Response } from "express";

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
