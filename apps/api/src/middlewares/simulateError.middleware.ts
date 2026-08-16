import { Request, Response, NextFunction } from "express";

export const simulateErrorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const simulateError = req.query.simulateError === "true";
  if (simulateError) {
    throw new Error("Simulated error");
  }
  next();
};
