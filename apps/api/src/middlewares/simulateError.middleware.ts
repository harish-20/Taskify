import { Request, Response, NextFunction } from "express";

export const simulateErrorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const simulateError = req.query.simulateError === "true";
  const staleTime = req.query.staleTime
    ? parseInt(req.query.staleTime as string, 10)
    : 0;

  if (staleTime > 0) {
    setTimeout(() => {
      if (simulateError) {
        throw new Error("Simulated error");
      }

      next();
    }, staleTime);
  } else {
    next();
  }
};
