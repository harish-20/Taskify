import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/verifyToken.js";
import { getMilliSeconds } from "../utils/getMilliSeconds.js";
import { InvalidArgument } from "../utils/CustomError.js";
import { sendMagicLink } from "../utils/mailer.js";
import { sendResponse } from "../utils/response.js";

import { ApiResponse } from "@repo/shared/types";

import { registerSchema, RegisterBody } from "../schemas/auth.schema.js";

import crypto from "node:crypto";
import { RequestHandler } from "express";

import { createUser } from "../services/user.service.js";
import { MagicToken } from "../models/magicToken.model.js";
import { IUser } from "../models/user.model.js";

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
    const hashedToken = crypto
      .createHash("sha256")
      .update(magicToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + getMilliSeconds({ minutes: 15 }));

    await MagicToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt,
    });

    await sendMagicLink(name, email, magicToken);

    const payload: ApiResponse = {
      success: true,
      message: "Registration successful, check your email for magic link",
      data: { id: user.id, name: user.name, email: user.email },
    };
    sendResponse(res, 201, payload);
  } catch (err) {
    next(err);
  }
};

export const signinUser: RequestHandler<{}, any, { user: IUser }> = async (
  req,
  res,
  next
) => {
  try {
    const user = req.user as IUser;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: getMilliSeconds({ days: 7 }),
    });

    const payload: ApiResponse = {
      success: true,
      message: "Signin successfull",
      data: { user, accessToken },
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};
