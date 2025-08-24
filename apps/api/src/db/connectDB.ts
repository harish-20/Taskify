import { MONGO_URI } from "../configs/index.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  logger.info("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.warn("MongoDB connection closed due to app termination");
  process.exit(0);
});

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
  } catch (err: any) {
    logger.error("DB connection failed!", err.message);
    process.exit(1);
  }
};

export default connectDB;
