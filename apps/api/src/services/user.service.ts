import {
  User,
  AuthProvider,
  AccountStatus,
  IUser,
} from "../models/user.model.js";
import { EmailAlreadyExists, InvalidArgument } from "../utils/CustomError.js";

import bcrypt from "bcrypt";

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
    passwordHash = await bcrypt.hash(password, 10);
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
