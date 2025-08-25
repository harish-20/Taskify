import { getMilliSeconds } from "../utils/getMilliSeconds.js";
import { InvalidArgument } from "../utils/CustomError.js";
import { sendMagicLink } from "../utils/mailer.js";

import { registerSchema, RegisterBody } from "../schemas/auth.schema.js";

import crypto from "node:crypto";
import { RequestHandler } from "express";

import { createUser } from "../services/user.service.js";
import { MagicToken } from "../models/magicToken.model.js";

export const registerUser: RequestHandler<{}, any, RegisterBody> = async (
  req,
  res,
  next
) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message);
      return next(new InvalidArgument("Invalid arguments", errors));
    }

    const { name, email, password } = validation.data;

    const user = await createUser({ name, email, password });

    const magicToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + getMilliSeconds({ minutes: 15 }));

    await MagicToken.create({
      userId: user._id,
      token: magicToken,
      expiresAt,
    });

    await sendMagicLink(email, magicToken);

    res.status(201).send({
      success: true,
      message: "Registration successful, check your email for magic link",
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};
