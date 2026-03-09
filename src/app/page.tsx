"use client";

import Link from "next/link";
import Image from "next/image";
import { useHaradaStore } from "@/lib/store";
import { ChartCard } from "@/components/chart-card";
import { Button } from "@/components/ui/button";
import { DialogueBox } from "@/components/dialogue-box";
import { useEffect, useState } from "react";

export default function Home() {
  const charts = useHaradaStore((s) => s.charts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Hero */}
        <header className="mb-12 sm:mb-20">
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src="/old-man.png"
              alt="Grumpy old man"
              width={160}
              height={160}
              className="pixelated mb-6"
              style={{ imageRendering: "pixelated" }}
              priority
            />
            <h1 className="font-pixel text-3xl sm:text-5xl tracking-tight text-foreground leading-[1.4]">
              i oughta
            </h1>
          </div>

          <DialogueBox
            text="Listen up, kid. You got ONE big goal? Good. I'm gonna help you break it into 64 things you oughta be doing every single day. No excuses."
            speed={20}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            <Link href="/create">
              <Button size="lg" className="font-pixel text-xs px-10 h-12">
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
          <h2 className="font-pixel text-xs uppercase tracking-widest text-muted-foreground mb-8">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Set your goal", desc: "One ambitious, central objective." },
              { step: "02", title: "8 subgoals", desc: "Break it into 8 supporting areas." },
              { step: "03", title: "64 behaviors", desc: "Define 8 actions per subgoal." },
            ].map((item) => (
              <div key={item.step} className="dialogue-border p-4 bg-card">
                <p className="font-pixel text-lg text-foreground/30 mb-2">
                  {item.step}
                </p>
                <p className="font-pixel text-[10px] text-foreground mb-1 leading-relaxed">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Charts */}
        {hydrated && charts.length > 0 && (
          <section>
            <h2 className="font-pixel text-xs uppercase tracking-widest text-muted-foreground mb-6">
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
