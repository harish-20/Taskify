import { compare } from "bcrypt";
import { AuthProvider, IUser, User } from "../models/user.model.js";
import {
  AccountNotExists,
  DifferentProviderAccount,
  InvalidPassword,
} from "../utils/CustomError.js";

interface LocalUser extends IUser {
  provider: AuthProvider.LOCAL;
  passwordHash: string;
}

function isLocalUser(user: IUser): user is LocalUser {
  return (
    user.provider === AuthProvider.LOCAL && user.passwordHash !== undefined
  );
}

export const validateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).lean<IUser>();

  if (user === null) {
    throw new AccountNotExists();
  }

  if (!isLocalUser(user)) {
    throw new DifferentProviderAccount(
      `Please login with ${user.provider} account.`,
      user.provider
    );
  }

  const isPasswordMatched = await compare(password, user.passwordHash);

  if (!isPasswordMatched) {
    throw new InvalidPassword();
  }

  return user;
};
