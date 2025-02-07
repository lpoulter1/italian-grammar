import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, username, score, newUsername, newScore } =
      await request.json();

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

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
