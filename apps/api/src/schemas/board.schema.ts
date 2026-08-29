import { z } from "zod";

import { MONGO_DB_ID_RX } from "../constants/MongoDbIdRegex.js";

const boardColumnsSchema = z.array(
  z.object({
    name: z.string().trim().min(1, "Column name is required"),
    order: z.number().int().min(0),
  }),
);

export const createBoardSchema = z.object({
  name: z.string().trim().min(1, "Board name is required"),
  description: z.string().trim().optional(),
  team: z.string().regex(MONGO_DB_ID_RX, "Invalid team ID").optional(),
  members: z
    .array(z.string().regex(MONGO_DB_ID_RX, "Invalid member ID"))
    .optional(),
  columns: boardColumnsSchema.optional(),
});

export const updateBoardSchema = createBoardSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export const boardIdParamSchema = z.object({
  boardId: z.string().regex(MONGO_DB_ID_RX, "Invalid board ID"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
