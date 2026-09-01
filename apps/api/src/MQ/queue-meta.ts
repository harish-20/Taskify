export const QUEUE_NAMES = {
  EMAIL: "email",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const JOB_NAMES = {
  SEND_MAGIC_LINK: "send-magic-link",
  SEND_WELCOME: "send-welcome-email",
  SEND_PASSWORD_RESET: "send-password-reset",
} as const;

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];
