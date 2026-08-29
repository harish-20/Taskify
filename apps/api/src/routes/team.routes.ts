import { Router } from "express";

import {
  addMember,
  getTeam,
  registerTeam,
  removeMember,
} from "../controllers/team.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { createTeamSchema, teamMemberSchema } from "../schemas/team.schema.js";

const teamRouter = Router();

teamRouter.get("/", authMiddleware, getTeam);
teamRouter.post(
  "/",
  authMiddleware,
  validateRequest(createTeamSchema),
  registerTeam,
);
teamRouter.post(
  "/:teamId/members",
  authMiddleware,
  validateRequest(teamMemberSchema),
  addMember,
);
teamRouter.delete("/:teamId/members/:memberId", authMiddleware, removeMember);

export default teamRouter;
