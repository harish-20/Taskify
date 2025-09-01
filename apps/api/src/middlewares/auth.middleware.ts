import { InvalidArgument } from "../utils/CustomError.js";

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { findUserById } from "../services/user.service.js";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new InvalidArgument("Authorization token is required");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    req.user = await findUserById(decoded.id);

    return next();
  } catch (err) {
    return next(new InvalidArgument("Invalid or expired access token"));
  }
};
