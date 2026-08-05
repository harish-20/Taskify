import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const fileLogFormat = winston.format.printf(
  ({ timestamp, level, message, stack, ...meta }) => {
    const renderedMessage = stack ?? message;
    let metadata = "";

    if (Object.keys(meta).length > 0) {
      try {
        metadata = `\n${JSON.stringify(meta, null, 2)}`;
      } catch {
        metadata = "\n[unserializable metadata]";
      }
    }

    return `${timestamp} [${level.toUpperCase()}] ${renderedMessage}${metadata}`;
  },
);

const appTransport = new DailyRotateFile({
  filename: "logs/application/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss a" }),
    winston.format.errors({ stack: true }),
    fileLogFormat,
  ),
});

const errorTransport = new DailyRotateFile({
  filename: "logs/errors/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "60d",
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss a" }),
    winston.format.errors({ stack: true }),
    fileLogFormat,
  ),
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.splat(),
  ),
  defaultMeta: {
    service: "taskify-api",
  },
  transports: [
    appTransport,
    errorTransport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "hh:mm:ss a",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions/exception-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "90d",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss a" }),
        winston.format.errors({ stack: true }),
        fileLogFormat,
      ),
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: "logs/rejections/rejection-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "90d",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss a" }),
        winston.format.errors({ stack: true }),
        fileLogFormat,
      ),
    }),
  ],
});

export default logger;
