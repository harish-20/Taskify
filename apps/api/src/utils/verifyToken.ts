import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../configs/index.js";

import { getMilliSeconds } from "./getMilliSeconds.js";

import jwt from "jsonwebtoken";

import { IUser } from "../models/user.model.js";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_ACCESS_SECRET!, {
    expiresIn: getMilliSeconds({ hours: 1 }),
  });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET!, {
    expiresIn: getMilliSeconds({ days: 7 }),
  });
};
