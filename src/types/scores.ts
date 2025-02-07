export type Score = {
  id: string;
  username: string;
  email?: string | null;
  score: number;
  accuracy: number;
  verb_type: string;
  total_attempts: number;
  created_at: string;
};

export type NewScore = Omit<Score, "id" | "created_at">;
