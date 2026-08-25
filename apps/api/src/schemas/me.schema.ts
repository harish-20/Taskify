import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().min(1, "name is required"),
});

export type EditUserSchema = z.infer<typeof editUserSchema>;
