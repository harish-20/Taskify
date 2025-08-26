import dotenv from "dotenv";

dotenv.config();

const {
  PORT = 8080,
  MONGO_URI,
  ENV_CHECK = false,
  GMAIL_EMAIL,
  GMAIL_APP_PASSWORD,
  FRONTEND_URL,
} = process.env;

const FROM_EMAIL = `Taskify <${GMAIL_EMAIL}>`;

if (!ENV_CHECK) {
  throw new Error("Env is not configured");
}

export {
  PORT,
  MONGO_URI,
  GMAIL_EMAIL,
  GMAIL_APP_PASSWORD,
  FROM_EMAIL,
  FRONTEND_URL,
};
