import { Processor } from "bullmq";

import { logger } from "../../utils/logger.js";
import { sendMagicLink } from "../../utils/mailer.js";
import { JOB_NAMES } from "../queue-meta.js";

export const emailProcessor: Processor<any, void, string> = async (
  job: any,
) => {
  switch (job.name) {
    case JOB_NAMES.SEND_MAGIC_LINK: {
      const { name, email, magicToken } = job.data;
      logger.info(`Processing email job for: ${email}`);

      await sendMagicLink(name, email, magicToken);
      break;
    }

    default:
      logger.warn(`Unknown email job: ${job.name}`);
      break;
  }
};
