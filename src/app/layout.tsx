import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "ScaleShift | Content Growth Through High-Performing Video";
const description =
  "ScaleShift helps creators and brands turn content into high-performing videos that grab attention, build authority, and convert viewers into paying clients.";

export const metadata: Metadata = {
  metadataBase: new URL("https://scaleshift.uk"),
  title,
  description,
  applicationName: "ScaleShift",
  keywords: ["video editing agency", "short-form video", "reels editing", "content growth", "high-retention editing"],
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/ar" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ScaleShift",
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${ibmPlexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
