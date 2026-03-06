"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useHaradaStore } from "@/lib/store";
import { HaradaChartGrid } from "@/components/harada-chart";
import { Button } from "@/components/ui/button";

export default function ChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const getChart = useHaradaStore((s) => s.getChart);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const chart = getChart(id);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading chart...</p>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Chart not found
          </h1>
          <p className="text-muted-foreground mb-8">
            This chart may have been deleted or the link is invalid.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="no-print flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to home
          </Link>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print Chart
          </Button>
        </div>

        <div className="mb-10">
          <h1 className="font-serif text-2xl sm:text-4xl text-foreground mb-2">
            {chart.mainGoal}
          </h1>
          <p className="text-sm text-muted-foreground no-print">
            Created{" "}
            {new Date(chart.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <HaradaChartGrid chart={chart} />
      </div>
    </div>
  );
}
