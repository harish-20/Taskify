import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

import { createTeamSchema } from "../schemas/team.schema.js";

import { registerTeam } from "../controllers/team.controller.js";

const teamRouter = Router();

teamRouter.post(
  "/",
  authMiddleware,
  validateRequest(createTeamSchema),
  registerTeam
);

export default teamRouter;
