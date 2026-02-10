export const STORAGE_KEYS = {
  USERS: 'peer-recognition-users',
  KUDOS: 'peer-recognition-kudos',
  REWARDS: 'peer-recognition-rewards',
  REDEMPTIONS: 'peer-recognition-redemptions',
  CURRENT_USER_ID: 'peer-recognition-current-user-id',
  /** JWT access token for API auth. Store via localStorage; clear on logout. */
  ACCESS_TOKEN: 'peer-recognition-access-token',
  /** JWT refresh token; clear on logout. */
  REFRESH_TOKEN: 'peer-recognition-refresh-token',
} as const;

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};
