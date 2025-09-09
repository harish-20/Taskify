import { MONGO_DB_ID_RX } from "../constants/MongoDbIdRegex.js";

import { z } from "zod";

import {
  OrganizationSize,
  SubscriptionPlan,
} from "../models/organization.model.js";

const addressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  zip: z.string().trim().optional(),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").trim(),
  description: z.string().trim().optional(),
  members: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid member ID"))
    .optional(),
  industry: z.string().trim().optional(),
  website: z.url().optional(),
  logoUrl: z.url().optional(),
  address: addressSchema.optional(),
  contactEmail: z.email("Invalid email").optional(),
  phoneNumber: z.string().trim().optional(),
  size: z.enum(OrganizationSize).optional(),
  verified: z.boolean().optional(),
  subscriptionPlan: z
    .enum(SubscriptionPlan)
    .optional()
    .default(SubscriptionPlan.FREE),
  teams: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid team ID"))
    .optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type OrganizationSchema = z.infer<typeof createOrganizationSchema>;
