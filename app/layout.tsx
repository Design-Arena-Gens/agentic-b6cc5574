import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbisLinks FAQ Chatbot",
  description: "Chat with OrbisLinks FAQ assistant",
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
