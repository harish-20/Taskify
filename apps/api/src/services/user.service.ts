import {
  EmailAlreadyExists,
  InvalidArgument,
  NotFound,
} from "../utils/CustomError.js";

import { Types } from "mongoose";
import bcrypt from "bcrypt";

import {
  User,
  AuthProvider,
  AccountStatus,
  IUser,
} from "../models/user.model.js";

interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  provider?: AuthProvider;
  providerId?: string;
  avatarUrl?: string;
}

export const createUser = async (input: CreateUserInput): Promise<IUser> => {
  const {
    name,
    email,
    password,
    provider = AuthProvider.LOCAL,
    providerId = email,
    avatarUrl,
  } = input;

  const existingUser = await User.findOne({ email, provider });
  if (existingUser) {
    throw new EmailAlreadyExists();
  }

  let passwordHash: string | undefined;
  if (provider === AuthProvider.LOCAL) {
    if (!password)
      throw new InvalidArgument("Password is required for local signup");
    passwordHash = await bcrypt.hash(password, 12);
  }

  const user = await User.create({
    name,
    email,
    passwordHash,
    provider,
    providerId,
    avatarUrl,
    status:
      provider === AuthProvider.LOCAL
        ? AccountStatus.VERIFICATION_EMAIL_SENT
        : AccountStatus.ACTIVE,
  });

  return user;
};

export const findUserById = async (userId: Types.ObjectId | string) => {
  const user = await User.findById(userId).lean<IUser>();
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
};

export const setAccountStatus = async (
  userId: Types.ObjectId | string,
  accountStatus: AccountStatus
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      status: accountStatus,
    },
    { new: true }
  ).lean<IUser>();

  if (!user) {
    throw new NotFound("User not found");
  }

  return user;
};
