import { Redis } from "ioredis";

import { REDIS_URL } from "../configs/index.js";
import { logger } from "../utils/logger.js";

export const bullmqRedis = new Redis(REDIS_URL!, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    const delay = Math.min(times * 1000, 5000);

    logger.warn(`Redis unavailable. Retrying in ${delay}ms...`);

    return delay;
  },
});
