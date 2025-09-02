// passport strategies
import "./auth/passport.js";

import { PORT } from "./configs/index.js";
import logger from "./utils/logger.js";

import express from "express";
import cors from "cors";
import passport from "passport";

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

import router from "./routes/index.routes.js";
import connectDB from "./db/connectDB.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Taskify sending vibes...😎");
});

app.use("/api/v1", router);

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  logger.info(`server kicking on PORT:${PORT}`);
});
