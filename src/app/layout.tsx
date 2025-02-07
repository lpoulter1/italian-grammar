import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
