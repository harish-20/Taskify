import { createClient } from "redis";

import { logger } from "../utils/logger.js";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  logger.error("Redis Error:", err);
});

redis.on("connect", () => {
  logger.info("Redis connecting...");
});

redis.on("ready", () => {
  logger.info("Redis connected and ready");
});

redis.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};

export default redis;
