import z from "zod";

import { emailSchema, passwordSchema } from "@/lib/schemas";

const SigninSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SigninType = z.infer<typeof SigninSchema>;

export default SigninSchema;
