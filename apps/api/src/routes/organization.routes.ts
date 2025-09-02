import { Router } from "express";

import { registerOrganization } from "../controllers/organization.controller.js";

const organizationRouter = Router();

organizationRouter.post("/", registerOrganization);

export default organizationRouter;
