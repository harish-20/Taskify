import { Forbidden, NotFound } from "../utils/CustomError.js";

import { RequestHandler } from "express";

import { UserRole } from "../models/user.model.js";

type RoleAuthMiddleware = (roles: UserRole[]) => RequestHandler;

export const roleAuthMiddleware: RoleAuthMiddleware =
  (roles) => async (req, res, next) => {
    try {
      if (!req.userObj?.role) {
        throw new NotFound(
          "User was not found. Make sure you handle token validation"
        );
      }
      if (!roles.includes(req.userObj.role)) {
        throw new Forbidden(
          "You do not have permission to access this resource"
        );
      }

      next();
    } catch (err) {
      return next(err);
    }
  };
