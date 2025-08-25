import mongoose, { Schema, Document, model } from "mongoose";

export enum AccountStatus {
  INVITE_SENT = "INVITE_SENT",
  VERIFICATION_EMAIL_SENT = "VERIFICATION_EMAIL_SENT",
  ACTIVE = "ACTIVE",
  INVITE_REJECTED = "INVITE_REJECTED",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
  GITHUB = "github",
  LINKEDIN = "linkedin",
}

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  provider: AuthProvider;
  providerId: string;
  name: string;
  avatarUrl?: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, lowercase: true },
    passwordHash: { type: String },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },
    providerId: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.INVITE_SENT,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, provider: 1 }, { unique: true });
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);
