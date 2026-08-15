import { Router } from "express";

import {
  getOrganization,
  registerOrganization,
  getOrganizationUsers,
} from "../controllers/organization.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createOrganizationSchema } from "../schemas/organization.schema.js";

const organizationRouter = Router();

organizationRouter.get("/", authMiddleware, getOrganization);
organizationRouter.post(
  "/",
  authMiddleware,
  validateRequest(createOrganizationSchema),
  registerOrganization,
);
organizationRouter.get("/users", authMiddleware, getOrganizationUsers);

export default organizationRouter;
