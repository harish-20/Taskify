export const localStorageKeys = {
  accessToken: "access",
  refreshToken: "refresh",
} as const;

export type LocalStorageKey = keyof typeof localStorageKeys;
