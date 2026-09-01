import { Redis } from "ioredis";

import { REDIS_URL } from "../configs/index.js";

export const bullmqRedis = new Redis(REDIS_URL!, {
  maxRetriesPerRequest: null,
});
