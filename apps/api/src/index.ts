// passport strategies
import "./auth/passport.js";

import cors from "cors";
import express from "express";
import passport from "passport";

import { PORT, NODE_ENV } from "./configs/index.js";
import connectDB from "./db/connectDB.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { simulateErrorMiddleware } from "./middlewares/simulateError.middleware.js";
import { connectRedis } from "./redis/index.js";
import router from "./routes/index.routes.js";
import logger from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);
if (NODE_ENV === "development") {
  app.use(requestLogger);
  app.use(simulateErrorMiddleware);
}

app.get("/", (req, res) => {
  res.send("Taskify sending vibes...😎");
});

app.use("/api/v1", router);

app.use(errorHandler);

connectDB();
connectRedis();

app.listen(PORT, () => {
  logger.info(`server kicking on PORT:${PORT}`);
});
