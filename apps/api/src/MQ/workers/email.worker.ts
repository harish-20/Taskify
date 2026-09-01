import { Worker } from "bullmq";

import { logger } from "../../utils/logger.js";
import { bullmqRedis } from "../index.js";
import { emailProcessor } from "../processors/email.processor.js";
import { QUEUE_NAMES } from "../queue-meta.js";

const emailWorker = new Worker(QUEUE_NAMES.EMAIL, emailProcessor, {
  connection: bullmqRedis,
  concurrency: 10,
});

emailWorker.on("completed", (job) => {
  logger.info(`Email job completed with id: ${job.id} ${job.name}`);
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    `Email job failed with id: ${job?.id} ${job?.name} - ${err.message}`,
  );
});
