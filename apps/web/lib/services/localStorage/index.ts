import { localStorageKeys, LocalStorageKey } from "./keys";

class LocalStorageAdapter {
  setValue(key: LocalStorageKey, value: string) {
    localStorage.setItem(localStorageKeys[key], value);
  }

  getValue(key: LocalStorageKey): string | null {
    return localStorage.getItem(localStorageKeys[key]);
  }

  removeValue(key: LocalStorageKey) {
    localStorage.removeItem(localStorageKeys[key]);
  }
}

export const customLocalStorage = new LocalStorageAdapter();
