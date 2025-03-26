// Define types for our storage system
export interface IStorageService {
  getItem<T>(key: string, defaultValue: T): T;
  setItem(key: string, value: unknown): void;
  removeItem(key: string): void;
  clear(): void;
}

// LocalStorage implementation
class LocalStorageService implements IStorageService {
  getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    const stored = localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        // If it's not valid JSON, return as string
        return stored as unknown as T;
      }
    }

    return defaultValue;
  }

  setItem(key: string, value: unknown): void {
    if (typeof window === "undefined") {
      return;
    }

    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  }

  removeItem(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }
}

// Create a singleton instance of the storage service
export const storageService: IStorageService = new LocalStorageService();

// Define keys for our storage to avoid magic strings
export const STORAGE_KEYS = {
  SELECTED_VERBS: "selectedVerbs",
  TOTAL_SCORE: "totalScore",
  TOTAL_ATTEMPTS: "totalAttempts",
  ANSWERED_CORRECTLY: "answeredCorrectly",
  SHOW_TRANSLATION: "showTranslation",
  SHOW_CONJUGATIONS: "showConjugations",
};

// SQLite example implementation for future reference (commented out)
/*
class SQLiteStorageService implements IStorageService {
  private db: SQLiteDatabase; // This would be your SQLite client

  constructor() {
    // Initialize SQLite connection
    // this.db = new SQLiteDatabase();
  }

  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      // const result = await this.db.get('SELECT value FROM settings WHERE key = ?', [key]);
      // return result ? JSON.parse(result.value) : defaultValue;
      return defaultValue;
    } catch (error) {
      console.error('Error getting item from SQLite', error);
      return defaultValue;
    }
  }

  async setItem(key: string, value: unknown): Promise<void> {
    // const serializedValue = JSON.stringify(value);
    // await this.db.run(
    //   'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    //   [key, serializedValue]
    // );
  }

  async removeItem(key: string): Promise<void> {
    // await this.db.run('DELETE FROM settings WHERE key = ?', [key]);
  }

  async clear(): Promise<void> {
    // await this.db.run('DELETE FROM settings');
  }
}
*/
