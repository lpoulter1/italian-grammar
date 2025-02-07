import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Italian Verb Practice",
  description:
    "Master Italian verb conjugations through interactive practice. Learn -are, -ere, and -ire verbs with instant feedback.",
  metadataBase: new URL("http://localhost:3001"),
  openGraph: {
    title: "Italian Verb Practice",
    description:
      "Master Italian verb conjugations through interactive practice. Learn -are, -ere, and -ire verbs with instant feedback.",
    url: "http://localhost:3001",
    siteName: "Italian Verb Practice",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Italian Verb Practice - Interactive Conjugation Learning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Italian Verb Practice",
    description:
      "Master Italian verb conjugations through interactive practice. Learn -are, -ere, and -ire verbs with instant feedback.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
