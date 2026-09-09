import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Recipe Preparation Agent — Zero Waste AI Cooking Assistant",
  description:
    "AI-powered culinary assistant that generates gourmet meals from leftovers you already have, manages weekly meal plans, and tracks food waste reduction.",
  keywords: [
    "recipes",
    "cooking",
    "AI recipe generator",
    "pantry assistant",
    "zero waste food",
    "meal planner",
    "sustainable cooking",
    "IBM watsonx",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-cream-100 flex flex-col antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
