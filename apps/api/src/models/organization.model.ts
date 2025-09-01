import { Schema, model, Types, Document } from "mongoose";

export enum OrganizationSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum SubscriptionPlan {
  FREE = "free",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

export interface IOrganization extends Document {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  industry?: string;
  website?: string;
  logoUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  contactEmail?: string;
  phoneNumber?: string;
  size?: OrganizationSize;
  verified: boolean;
  subscriptionPlan: SubscriptionPlan;
  teams: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    industry: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    contactEmail: { type: String },
    phoneNumber: { type: String },
    size: {
      type: String,
      enum: Object.values(OrganizationSize),
    },
    verified: { type: Boolean, default: false },
    subscriptionPlan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  { timestamps: true }
);

export const Organization = model<IOrganization>(
  "Organization",
  organizationSchema
);
