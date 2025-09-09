import { Router } from "express";

import { validateRequest } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { registerOrganization } from "../controllers/organization.controller.js";
import { createOrganizationSchema } from "../schemas/organization.schema.js";

const organizationRouter = Router();

organizationRouter.post(
  "/",
  authMiddleware,
  validateRequest(createOrganizationSchema),
  registerOrganization
);

export default organizationRouter;
