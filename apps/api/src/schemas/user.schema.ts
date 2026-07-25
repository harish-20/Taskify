import { z } from "zod";

import { MONGO_DB_ID_RX } from "../constants/MongoDbIdRegex.js";

export const createTestUsersSchema = z.object({
  organizationId: z.string().regex(MONGO_DB_ID_RX, "Invalid organization ID"),
  count: z.coerce
    .number()
    .int("count must be an integer")
    .min(1, "count must be at least 1")
    .max(5, "count cannot exceed 5"),
});

export type CreateTestUsersSchema = z.infer<typeof createTestUsersSchema>;
