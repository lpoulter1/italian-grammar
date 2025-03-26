import { storageService, STORAGE_KEYS } from "./storage";

/**
 * UserSettings service
 *
 * This service handles all user settings and preferences,
 * abstracting away the storage implementation details.
 */
export class UserSettings {
  /**
   * Load selected verbs from storage
   */
  getSelectedVerbs(): string[] {
    return storageService.getItem<string[]>(STORAGE_KEYS.SELECTED_VERBS, []);
  }

  /**
   * Save selected verbs to storage
   */
  saveSelectedVerbs(verbs: string[]): void {
    storageService.setItem(STORAGE_KEYS.SELECTED_VERBS, verbs);
  }

  /**
   * Load user progress data
   */
  getProgress(): {
    totalScore: number;
    totalAttempts: number;
    answeredCorrectly: string[];
  } {
    return {
      totalScore: storageService.getItem<number>(STORAGE_KEYS.TOTAL_SCORE, 0),
      totalAttempts: storageService.getItem<number>(
        STORAGE_KEYS.TOTAL_ATTEMPTS,
        0
      ),
      answeredCorrectly: storageService.getItem<string[]>(
        STORAGE_KEYS.ANSWERED_CORRECTLY,
        []
      ),
    };
  }

  /**
   * Save user progress data
   */
  saveProgress({
    totalScore,
    totalAttempts,
    answeredCorrectly,
  }: {
    totalScore: number;
    totalAttempts: number;
    answeredCorrectly: string[];
  }): void {
    storageService.setItem(STORAGE_KEYS.TOTAL_SCORE, totalScore);
    storageService.setItem(STORAGE_KEYS.TOTAL_ATTEMPTS, totalAttempts);
    storageService.setItem(STORAGE_KEYS.ANSWERED_CORRECTLY, answeredCorrectly);
  }

  /**
   * Reset user progress
   */
  resetProgress(): void {
    storageService.setItem(STORAGE_KEYS.TOTAL_SCORE, 0);
    storageService.setItem(STORAGE_KEYS.TOTAL_ATTEMPTS, 0);
    storageService.setItem(STORAGE_KEYS.ANSWERED_CORRECTLY, []);
  }

  /**
   * Get UI preferences
   */
  getUiPreferences(): {
    showTranslation: boolean;
    showConjugations: boolean;
  } {
    return {
      showTranslation: storageService.getItem<boolean>(
        STORAGE_KEYS.SHOW_TRANSLATION,
        false
      ),
      showConjugations: storageService.getItem<boolean>(
        STORAGE_KEYS.SHOW_CONJUGATIONS,
        false
      ),
    };
  }

  /**
   * Save UI preferences
   */
  saveUiPreferences({
    showTranslation,
    showConjugations,
  }: {
    showTranslation: boolean;
    showConjugations: boolean;
  }): void {
    storageService.setItem(STORAGE_KEYS.SHOW_TRANSLATION, showTranslation);
    storageService.setItem(STORAGE_KEYS.SHOW_CONJUGATIONS, showConjugations);
  }

  /**
   * Clear all user data
   */
  clearAll(): void {
    // Clear only the keys related to this app
    Object.values(STORAGE_KEYS).forEach((key) => {
      storageService.removeItem(key);
    });
  }
}

// Create a singleton instance
export const userSettings = new UserSettings();
