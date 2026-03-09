import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const mono = VT323({
  weight: "400",
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "i oughta — Goal Setting Method",
  description:
    "Set and accomplish your goals with a grumpy old man's help. Break your main goal into 8 subgoals and 64 actionable behaviors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pixel.variable} ${mono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
