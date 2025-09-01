import { Schema, model, Types } from "mongoose";

const organizationProfileSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
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
      type: Number,
    },
    website: { type: String },

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
      primaryUserRole: {
        type: String,
      },
      ageGroup: {
        type: String,
      },
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

export const OrganizationProfile = model(
  "OrganizationProfile",
  organizationProfileSchema
);
