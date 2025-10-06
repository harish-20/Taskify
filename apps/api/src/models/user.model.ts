import { Schema, Document, model, Types } from "mongoose";

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

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  LEAD = "lead",
  MEMBER = "member",
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash?: string;
  provider: AuthProvider;
  providerId: string;
  name: string;
  avatarUrl?: string;
  status: AccountStatus;
  role: UserRole;
  bio?: string;
  organizationId: Types.ObjectId;
  teamId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },
    providerId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    avatarUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.INVITE_SENT,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
    },
    bio: { type: String },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export const User = model<IUser>("User", userSchema);
