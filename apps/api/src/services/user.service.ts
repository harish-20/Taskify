import {
  DifferentProviderAccount,
  EmailAlreadyExists,
  InvalidArgument,
  NotFound,
} from "../utils/CustomError.js";

import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { Profile } from "passport-google-oauth20";

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

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail, provider });
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
    email: normalizedEmail,
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

export const handleGoogleUser = async (profile: Profile) => {
  const user = await User.findOne({ providerId: profile.id }).lean<IUser>();

  if (user?.provider && user.provider !== AuthProvider.GOOGLE) {
    throw new DifferentProviderAccount(
      `This email is already logged in with ${user.provider}`,
      user.provider
    );
  }

  if (!user) {
    if (profile.emails?.[0].value) {
      const user = await createUser({
        email: profile.emails[0].value,
        name: profile.displayName || "User",
        avatarUrl: profile.photos?.[0].value || "",
        provider: AuthProvider.GOOGLE,
        providerId: profile.id,
      });

      return user;
    } else {
      throw new NotFound("Email not found on google auth");
    }
  }

  return user;
};

export const findUserById = async (userId: Types.ObjectId | string) => {
  const user = await User.findById(userId, { passwordHash: 0 }).lean<IUser>();
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
  );

  if (!user) {
    throw new NotFound("User not found");
  }

  return user;
};
