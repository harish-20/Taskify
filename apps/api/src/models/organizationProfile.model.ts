import { Schema, model, Types, Document } from "mongoose";

export interface IOrganizationProfile extends Document {
  organization: Types.ObjectId;
  industry?: string;
  interests?: string[];
  location?: {
    country?: string;
    city?: string;
  };
  size?:
    | "0-20"
    | "20-50"
    | "50-100"
    | "100-200"
    | "200-500"
    | "500-1000"
    | "1000-2000"
    | "2000+";

  metrics?: {
    activeUsers?: number;
    tasksCreated?: number;
    projectsCreated?: number;
    teamsCreated?: number;
    lastActive?: Date;
    usageFrequency?: "daily" | "weekly" | "monthly" | "rare";
    retentionScore?: number;
  };

  acquisition?: {
    source?: "referral" | "ads" | "organic" | "partnership" | "other";
    campaign?: string;
    signupDate?: Date;
  };

  demographics?: {
    primaryUserRole?: string;
    ageGroup?: string;
  };

  techStack?: string[];
  integrationsUsed?: string[];
  feedback?: {
    satisfactionScore?: number;
    featureRequests?: string[];
    issuesReported?: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const organizationProfileSchema = new Schema<IOrganizationProfile>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true,
    },

    industry: { type: String },
    interests: [String],

    location: {
      country: String,
      city: String,
    },

    size: {
      type: String,
      enum: [
        "0-20",
        "20-50",
        "50-100",
        "100-200",
        "200-500",
        "500-1000",
        "1000-2000",
        "2000+",
      ],
    },

    metrics: {
      activeUsers: { type: Number, default: 0 },
      tasksCreated: { type: Number, default: 0 },
      projectsCreated: { type: Number, default: 0 },
      teamsCreated: { type: Number, default: 0 },
      lastActive: { type: Date },
      usageFrequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "rare"],
        default: "weekly",
      },
      retentionScore: { type: Number, default: 0 },
    },

    acquisition: {
      source: {
        type: String,
        enum: ["referral", "ads", "organic", "partnership", "other"],
      },
      campaign: { type: String },
      signupDate: { type: Date, default: Date.now },
    },

    demographics: {
      primaryUserRole: { type: String },
      ageGroup: { type: String },
    },

    techStack: [String],
    integrationsUsed: [String],

    feedback: {
      satisfactionScore: { type: Number, default: 0 },
      featureRequests: [String],
      issuesReported: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const OrganizationProfile = model<IOrganizationProfile>(
  "OrganizationProfile",
  organizationProfileSchema
);
