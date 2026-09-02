import { createClient } from "redis";

import { logger } from "../utils/logger.js";

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy(retries) {
      if (retries > 10) {
        logger.error("Redis reconnect attempts exhausted");
        return new Error("Redis unavailable");
      }

      const delay = Math.min(retries * 1000, 5000);

      logger.warn(`Redis unavailable. Retrying in ${delay}ms...`);

      return delay;
    },
  },
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
