import { Router } from "express";

import { getHealthInfo } from "../controllers/health.controller.js";

const healthRouter = Router();

healthRouter.get("/", getHealthInfo);

export default healthRouter;
