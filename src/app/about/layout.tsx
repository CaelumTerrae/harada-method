import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — i oughta",
  description:
    "Learn about the Harada Method, a structured goal-setting framework created by Takashi Harada, and how Shohei Ohtani used it to become one of the greatest baseball players of all time.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
