import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mahima Naik | Portfolio",
  description: "AI & Data Science Enthusiast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
