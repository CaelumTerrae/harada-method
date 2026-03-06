"use client";

import type { HaradaChart } from "@/lib/types";
import { HaradaChartGrid } from "@/components/harada-chart";

type StepChartPreviewProps = {
  chart: HaradaChart;
  highlightSubgoal?: number;
  message: string;
};

export function StepChartPreview({ chart, highlightSubgoal, message }: StepChartPreviewProps) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl text-foreground mb-2">
        Your Harada Chart
      </h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {message}
      </p>
      <HaradaChartGrid
        chart={chart}
        highlightSubgoal={highlightSubgoal}
        compact
      />
    </div>
  );
}
