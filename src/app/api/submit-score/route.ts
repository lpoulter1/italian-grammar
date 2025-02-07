import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { NewScore } from "@/types/scores";

// Create Supabase client with server-side env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key on server side
);

export async function POST(request: Request) {
  try {
    const newScore: NewScore = await request.json();

    // Validate the score data
    if (!newScore.username || typeof newScore.score !== "number") {
      return NextResponse.json(
        { error: "Invalid score data" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("scores").insert([
      {
        username: newScore.username,
        email: newScore.email,
        score: newScore.score,
        accuracy: newScore.accuracy,
        verb_type: newScore.verb_type,
        total_attempts: newScore.total_attempts,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting score:", error);
    return NextResponse.json(
      { error: "Failed to submit score" },
      { status: 500 }
    );
  }
}
