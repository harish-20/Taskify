import { JWT_ACCESS_SECRET } from "../configs/index.js";
import { Unauthorized } from "../utils/CustomError.js";

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { findUserById } from "../services/user.service.js";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Unauthorized("Authorization token is required");
    }

    const token = authHeader.split(" ")[1];

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET as string) as {
        id: string;
        email: string;
      };
    } catch {
      throw new Unauthorized("Invalid or expired access token");
    }

    const user = await findUserById(decoded.id);
    if (!user) {
      throw new Unauthorized("User not found or no longer exists");
    }

    req.userObj = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
