/**
 * Calculates the Levenshtein distance between two strings
 * This algorithm measures the minimum number of single-character edits
 * (i.e., insertions, deletions, or substitutions) required to change
 * one string into the other.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Determines if a user's answer is close to the correct answer
 * using Levenshtein distance
 */
export function isAlmostCorrect(
  userAnswer: string,
  correctAnswer: string
): boolean {
  const distance = levenshteinDistance(
    userAnswer.trim().toLowerCase(),
    correctAnswer.trim().toLowerCase()
  );
  return distance > 0 && distance <= 2; // Distance of 1 or 2 is considered "almost correct"
}

/**
 * Highlights the differences between two strings
 * Returns HTML with <span> tags highlighting the differences
 */
export function highlightDifferences(
  userAnswer: string,
  correctAnswer: string
): string {
  // This is a simplified version that just marks whole characters that don't match
  let result = "";
  const maxLength = Math.max(userAnswer.length, correctAnswer.length);

  for (let i = 0; i < maxLength; i++) {
    if (i >= userAnswer.length) {
      // Missing character in user answer
      result += `<span class="text-red-500 font-bold">${correctAnswer[i]}</span>`;
    } else if (i >= correctAnswer.length) {
      // Extra character in user answer
      result += `<span class="text-red-500 font-bold line-through">${userAnswer[i]}</span>`;
    } else if (userAnswer[i] !== correctAnswer[i]) {
      // Different character
      result += `<span class="text-red-500 font-bold">${correctAnswer[i]}</span>`;
    } else {
      // Matching character
      result += correctAnswer[i];
    }
  }

  return result;
}
