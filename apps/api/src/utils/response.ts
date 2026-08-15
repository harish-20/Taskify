import { ApiResponse } from "@repo/shared/types";
import { Response } from "express";


export function sendResponse<T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>
) {
  return res.status(statusCode).send(payload);
}
