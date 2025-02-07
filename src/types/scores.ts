export type Score = {
  id: string;
  username: string;
  score: number;
  accuracy: number;
  verb_type: string;
  total_attempts: number;
  created_at: string;
};

export type NewScore = Omit<Score, "id" | "created_at">;
