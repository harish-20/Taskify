import { Schema, Document, model, Types } from "mongoose";

export interface IMagicToken extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const magicTokenSchema = new Schema<IMagicToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

magicTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MagicToken = model<IMagicToken>("MagicToken", magicTokenSchema);
