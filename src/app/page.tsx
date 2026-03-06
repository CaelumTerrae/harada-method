"use client";

import Link from "next/link";
import { useHaradaStore } from "@/lib/store";
import { ChartCard } from "@/components/chart-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  const charts = useHaradaStore((s) => s.charts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle decorative top bar */}
      <div className="h-1 bg-gradient-to-r from-lime-200 via-green-200 via-yellow-200 to-amber-200" />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Hero */}
        <header className="mb-12 sm:mb-20">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Goal-Setting Framework
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl tracking-tight text-foreground leading-[1.1]">
            Harada
            <br />
            <span className="text-muted-foreground/40">Method</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Turn one ambitious goal into 64 concrete, actionable behaviors.
            Define 8 subgoals, break each into 8 daily practices, and see your
            entire plan on a single chart.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            <Link href="/create">
              <Button size="lg" className="text-base px-10 h-12">
                Start a New Chart
              </Button>
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About the Method &rarr;
            </Link>
          </div>
        </header>

        {/* How it works */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Set your goal", desc: "One ambitious, central objective." },
              { step: "02", title: "8 subgoals", desc: "Break it into 8 supporting areas." },
              { step: "03", title: "64 behaviors", desc: "Define 8 actions per subgoal." },
            ].map((item) => (
              <div key={item.step}>
                <p className="font-serif text-2xl text-foreground/20 mb-2">
                  {item.step}
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
        </section>

        {/* Saved Charts */}
        {hydrated && charts.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Your Charts
            </h2>
            <div className="flex flex-col gap-3">
              {charts.map((chart) => (
                <ChartCard key={chart.id} chart={chart} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
