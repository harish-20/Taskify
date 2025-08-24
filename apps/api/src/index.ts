import { PORT } from "./configs/index.js";
import logger from "./utils/logger.js";

import express from "express";
import cors from "cors";

import router from "./routes/index.route.js";
import connectDB from "./db/connectDB.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/", router);

connectDB();

app.listen(PORT, () => {
  logger.info(`server kicking on http://localhost:${PORT}`);
});
