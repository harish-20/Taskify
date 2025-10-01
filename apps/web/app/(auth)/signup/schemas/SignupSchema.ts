import z from "zod";

import { emailSchema, passwordSchema } from "@/lib/schemas";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
});

export type SignupType = z.infer<typeof SignupSchema>;

export default SignupSchema;
