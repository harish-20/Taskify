import { z } from "zod";

const addressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim(),
  country: z.string().trim(),
  zip: z.string().trim().optional(),
});

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").trim(),
  description: z.string().trim().optional(),
  address: addressSchema,
  contactEmail: z.email("Invalid email"),
  phoneNumber: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .refine(
      (v) => !v || /^[+()0-9\s\-]{6,32}$/.test(v),
      "phoneNumber must contain only digits, spaces, parentheses, + or -"
    ),

  website: z.url("Invalid URL"),

  industry: z.string(),

  size: z.enum([
    "0-20",
    "20-50",
    "50-100",
    "100-200",
    "200-500",
    "500-1000",
    "1000-2000",
    "2000+",
  ]),

  // interests and tech stack arrays
  interests: z.array(z.string().trim()),
  techStack: z.array(z.string().trim()),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
