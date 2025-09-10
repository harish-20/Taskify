import { z } from "zod";
import { MONGO_DB_ID_RX } from "../constants/MongoDbIdRegex.js";

export const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").trim(),
  description: z.string().trim().optional(),
  organizationId: z.string().regex(MONGO_DB_ID_RX, "Invalid organization ID"),
  members: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid member ID"))
    .optional(),
});

export type TeamSchema = z.infer<typeof createTeamSchema>;
