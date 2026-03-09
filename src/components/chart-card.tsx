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
    <div className="group relative flex items-start justify-between gap-4 dialogue-border bg-card p-5 transition-all hover:bg-muted/50">
      <Link href={`/chart/${chart.id}`} className="flex-1 min-w-0">
        <p className="font-pixel text-[10px] leading-relaxed text-foreground truncate">
          {chart.mainGoal}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{formatted}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          {chart.subgoals.filter((s) => s.text).length} subgoals
        </p>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0 font-pixel text-[8px]"
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
