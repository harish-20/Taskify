import dotenv from "dotenv";

dotenv.config();

const {
  PORT = 8080,
  MONGO_URI,
  ENV_CHECK = false,
  REDIS_URL,
  // Email Configs
  GMAIL_EMAIL,
  GMAIL_APP_PASSWORD,
  // Frontend Configs
  FRONTEND_URL,
  // JWT Configs
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  // Google OAuth Configs
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  // AWS Configs
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
  // Node Environment
  NODE_ENV,
} = process.env;

const FROM_EMAIL = `Taskify <${GMAIL_EMAIL}>`;

if (ENV_CHECK === "true") {
  if (
    !PORT ||
    !MONGO_URI ||
    !GMAIL_EMAIL ||
    !GMAIL_APP_PASSWORD ||
    !FRONTEND_URL ||
    !JWT_ACCESS_SECRET ||
    !JWT_REFRESH_SECRET ||
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET ||
    !GOOGLE_CALLBACK_URL ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_REGION ||
    !AWS_BUCKET_NAME ||
    !REDIS_URL
  ) {
    throw new Error("Env is not configured");
  }
}

export {
  PORT,
  MONGO_URI,
  GMAIL_EMAIL,
  GMAIL_APP_PASSWORD,
  FROM_EMAIL,
  FRONTEND_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
  NODE_ENV,
  REDIS_URL,
};
