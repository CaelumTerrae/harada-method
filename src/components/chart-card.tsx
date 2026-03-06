"use client";

import Link from "next/link";
import type { HaradaChart } from "@/lib/types";
import { useHaradaStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ChartCard({ chart }: { chart: HaradaChart }) {
  const deleteChart = useHaradaStore((s) => s.deleteChart);
  const date = new Date(chart.createdAt);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card p-5 transition-all hover:border-border hover:shadow-sm">
      <Link href={`/chart/${chart.id}`} className="flex-1 min-w-0">
        <p className="font-serif text-lg leading-snug text-foreground truncate">
          {chart.mainGoal}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{formatted}</p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          {chart.subgoals.filter((s) => s.text).length} subgoals
        </p>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
        onClick={(e) => {
          e.preventDefault();
          if (confirm("Delete this chart?")) deleteChart(chart.id);
        }}
      >
        Delete
      </Button>
    </div>
  );
}
