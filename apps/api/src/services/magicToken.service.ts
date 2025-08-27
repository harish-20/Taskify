import crypto from "node:crypto";
import { MagicToken } from "../models/magicToken.model.js";
import { getMilliSeconds } from "../utils/getMilliSeconds.js";

export const createMagicToken = async (userId: string): Promise<string> => {
  const magicToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(magicToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + getMilliSeconds({ minutes: 15 }));

  await MagicToken.create({ userId, token: hashedToken, expiresAt });

  return magicToken;
};

export const verifyMagicToken = async (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const record = await MagicToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  });

  if (!record) return null;

  await MagicToken.deleteOne({ _id: record._id });
  return record.userId;
};
