import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/verifyToken.js";
import { InvalidArgument, NotFound } from "../utils/CustomError.js";
import { sendMagicLink } from "../utils/mailer.js";
import { sendResponse } from "../utils/response.js";
import { getMilliSeconds } from "../utils/getMilliSeconds.js";

import { ApiResponse } from "@repo/shared/types";
import { registerSchema, RegisterBody } from "../schemas/auth.schema.js";

import { RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserById,
  setAccountStatus,
} from "../services/user.service.js";
import { AccountStatus, IUser } from "../models/user.model.js";

import {
  createMagicToken,
  verifyMagicToken,
} from "../services/magicToken.service.js";

export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: getMilliSeconds({ days: 7 }),
  });
};

export const registerUser: RequestHandler<
  {},
  ApiResponse,
  RegisterBody
> = async (req, res, next) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => issue.message);
      return next(new InvalidArgument("Invalid arguments", errors));
    }

    const { name, email, password } = validation.data;
    const user = await createUser({ name, email, password });

    const magicToken = await createMagicToken(user.id);
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

export const signinUser: RequestHandler<
  {},
  ApiResponse,
  { user: IUser }
> = async (req, res, next) => {
  try {
    const user = req.user as IUser;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);

    const payload: ApiResponse = {
      success: true,
      message: "Signin successful",
      data: { user, accessToken },
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const verifyMagicLink: RequestHandler<
  {},
  ApiResponse,
  { token: string }
> = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw new InvalidArgument("Token is required");

    const userId = await verifyMagicToken(token as string);
    if (!userId) throw new NotFound("Invalid or expired token");

    const user = await setAccountStatus(userId, AccountStatus.ACTIVE);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, refreshToken);

    const payload: ApiResponse = {
      success: true,
      message: "Magic link verified successfully",
      data: { user, accessToken },
    };
    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken: RequestHandler<{}, ApiResponse> = async (
  req,
  res,
  next
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new InvalidArgument("Refresh token is required");

    let decoded: any;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      );
    } catch (err) {
      throw new InvalidArgument("Invalid or expired refresh token");
    }

    const user = await findUserById(decoded.id);
    if (!user) throw new NotFound("User not found");

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    setRefreshTokenCookie(res, newRefreshToken);

    const payload: ApiResponse = {
      success: true,
      message: "Token refreshed successfully",
      data: { user, accessToken: newAccessToken },
    };

    return sendResponse(res, 200, payload);
  } catch (err) {
    next(err);
  }
};
