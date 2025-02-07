import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2b6cb0",
          borderRadius: "8px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        IP
      </div>
    ),
    {
      ...size,
    }
  );
}
