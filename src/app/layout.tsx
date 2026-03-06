import type { Metadata } from "next";
import { DM_Serif_Display, Libre_Franklin } from "next/font/google";
import "./globals.css";

const serif = DM_Serif_Display({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
});

const sans = Libre_Franklin({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harada — Goal Setting Method",
  description:
    "Set and accomplish your goals using the Harada Method. Break your main goal into 8 subgoals and 64 actionable behaviors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
