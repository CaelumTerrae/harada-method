import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Harada Method",
  description:
    "Learn about the Harada Method, a structured goal-setting framework created by Takashi Harada, and how Shohei Ohtani used it to become one of the greatest baseball players of all time.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-1 bg-gradient-to-r from-lime-200 via-green-200 via-yellow-200 to-amber-200" />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to home
        </Link>

        <header className="mt-8 mb-10 sm:mt-12 sm:mb-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
            About
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl tracking-tight text-foreground leading-[1.1]">
            The Harada
            <br />
            <span className="text-muted-foreground/40">Method</span>
          </h1>
        </header>

        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-6">
            What is it?
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              The Harada Method is a structured goal-setting and
              self-management framework developed by{" "}
              <span className="text-foreground font-medium">
                Takashi Harada
              </span>
              , a Japanese educator who originally designed it to help
              underperforming students take ownership of their goals and
              achieve measurable results.
            </p>
            <p>
              At its core, the method asks you to start with one ambitious
              objective and systematically break it down into actionable
              pieces. The full framework consists of:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {[
              {
                num: "01",
                title: "Determine your goal",
                desc: "Define a single, clear objective that drives everything else.",
              },
              {
                num: "02",
                title: "Identify purpose & value",
                desc: "Understand why this goal matters to you and the people around you.",
              },
              {
                num: "03",
                title: "Self-analysis",
                desc: "Honestly assess your strengths and weaknesses relative to the goal.",
              },
              {
                num: "04",
                title: "64-action chart",
                desc: "Break the goal into 8 subgoals, then 8 concrete behaviors per subgoal.",
              },
              {
                num: "05",
                title: "Ongoing diary",
                desc: "Monitor your actions, outcomes, and performance over time.",
              },
              {
                num: "06",
                title: "Coaching & feedback",
                desc: "Seek guidance from mentors to stay accountable and course-correct.",
              },
            ].map((item) => (
              <div key={item.num}>
                <p className="font-serif text-xl text-foreground/20 mb-1">
                  {item.num}
                </p>
                <p className="font-medium text-sm text-foreground mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            The centerpiece is the{" "}
            <span className="text-foreground font-medium">
              64-action chart
            </span>{" "}
            (also called the open window 64 chart) &mdash; a single-page
            visual grid where your main goal sits at the center, surrounded
            by 8 subgoals, each radiating outward into 8 daily behaviors.
            It turns an abstract ambition into a concrete, repeatable
            system.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Shohei Ohtani & the Harada Method
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              One of the most famous practitioners of the Harada Method is{" "}
              <span className="text-foreground font-medium">
                Shohei Ohtani
              </span>
              . While still a high school student in Japan, Ohtani filled
              out a 64-action chart with a central goal of being drafted by
              eight NPB (Nippon Professional Baseball) teams in the first
              round.
            </p>
            <p>
              His handwritten chart &mdash; completed as a teenager
              &mdash; is a remarkable display of focus, self-awareness, and
              determination. His 8 subgoals covered everything from
              pitching mechanics and physical conditioning to mental
              fortitude and character. Notably, one of his 64 behaviors was
              simply{" "}
              <span className="text-foreground font-medium italic">
                &ldquo;pick up trash&rdquo;
              </span>{" "}
              &mdash; a small daily act reflecting the discipline and
              humility that would come to define his career.
            </p>
            <p>
              Ohtani went on to become arguably the greatest two-way player
              in the history of baseball, starring in both the NPB and
              MLB. His story is a testament to the power of structured
              goal-setting and deliberate daily action &mdash; the very
              principles at the heart of the Harada Method.
            </p>
            <p>
              You can view a copy of Ohtani&apos;s original handwritten
              chart in{" "}
              <a
                href="https://www.reddit.com/r/Dodgers/comments/1oy8p78/harada_method_and_shohei_ohtani/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 decoration-foreground/25 hover:decoration-foreground/60 transition-colors"
              >
                this Reddit post
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Why this site?
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            This site was inspired by Ohtani&apos;s use of the Harada
            Method. The goal is to make the 64-action chart accessible as a
            free, digital tool &mdash; so anyone can map out their
            ambitions the same way Ohtani did with pen and paper as a high
            schooler.
          </p>
        </section>

        <div className="border-t border-border/40 pt-8">
          <Link
            href="/create"
            className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
          >
            Start your own chart &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
