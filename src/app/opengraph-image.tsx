import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Italian Verb Practice - Interactive Conjugation Learning";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #e8f4ff, #ffffff)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              color: "#1a365d",
              textAlign: "center",
              margin: "0",
              lineHeight: "1.1",
            }}
          >
            Italian Verb Practice
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#4a5568",
              textAlign: "center",
              margin: "0",
              maxWidth: "800px",
            }}
          >
            Master Italian verb conjugations through interactive practice
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                padding: "16px 32px",
                background: "#2b6cb0",
                color: "white",
                borderRadius: "12px",
                fontSize: "24px",
              }}
            >
              -are verbs
            </div>
            <div
              style={{
                padding: "16px 32px",
                background: "#2c7a7b",
                color: "white",
                borderRadius: "12px",
                fontSize: "24px",
              }}
            >
              -ere verbs
            </div>
            <div
              style={{
                padding: "16px 32px",
                background: "#805ad5",
                color: "white",
                borderRadius: "12px",
                fontSize: "24px",
              }}
            >
              -ire verbs
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
