import dotenv from "dotenv";

dotenv.config();

const {
  PORT = 8080,
  MONGO_URI,
  ENV_CHECK = false,
  GMAIL_EMAIL,
  GMAIL_APP_PASSWORD,
  FRONTEND_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  NODE_ENV = "development",
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
    !GOOGLE_CALLBACK_URL
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
  NODE_ENV,
};
