import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Italian Verb Practice",
  description:
    "Master Italian verb conjugations through interactive practice. Learn -are, -ere, and -ire verbs with instant feedback.",
  metadataBase: new URL("https://italian-grammar.vercel.app"),
  openGraph: {
    title: "Italian Verb Practice",
    description:
      "Master Italian verb conjugations through interactive practice. Learn -are, -ere, and -ire verbs with instant feedback.",
    url: "https://italian-grammar.vercel.app",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
