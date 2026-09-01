import { Queue } from "bullmq";

import { bullmqRedis } from "../index.js";
import { QUEUE_NAMES } from "../queue-meta.js";

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: bullmqRedis,
});
