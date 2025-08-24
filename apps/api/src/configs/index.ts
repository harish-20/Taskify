import dotenv from "dotenv";

dotenv.config();

const { PORT = 8080, MONGO_URI, ENV_CHECK = false } = process.env;

if (!ENV_CHECK) {
  throw new Error("Env is not configured");
}

export { PORT, MONGO_URI };
