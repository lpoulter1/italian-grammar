import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Add a GET handler to respond with a proper error
export async function GET() {
  return new NextResponse("Method not allowed. Please use POST.", {
    status: 405,
    headers: {
      Allow: "POST",
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, score, newUsername, newScore } = body;

    // Validate required fields
    if (!email || !username || !score || !newUsername || !newScore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`Sending notification to ${email} for user ${username}`);

    const data = await resend.emails.send({
      from: "Italian Grammar <notifications@scoreboard.netrunner.run>",
      to: [email],
      subject: "Your Score Has Been Beaten!",
      html: `
        <h1>Your Score Has Been Beaten!</h1>
        <p>Hi ${username},</p>
        <p>Your score of ${score} has been beaten by ${newUsername} with a score of ${newScore}!</p>
        <p>Come back and practice more to reclaim your position on the leaderboard!</p>
        <br/>
        <p>Best regards,</p>
        <p>Italian Grammar Practice</p>
      `,
    });

    console.log("Email sent successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
