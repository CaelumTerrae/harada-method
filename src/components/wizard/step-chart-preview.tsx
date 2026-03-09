"use client";

import type { HaradaChart } from "@/lib/types";
import { HaradaChartGrid } from "@/components/harada-chart";
import { DialogueBox } from "@/components/dialogue-box";

type StepChartPreviewProps = {
  chart: HaradaChart;
  highlightSubgoal?: number;
  message: string;
};

export function StepChartPreview({ chart, highlightSubgoal, message }: StepChartPreviewProps) {
  return (
    <div>
      <h2 className="font-pixel text-xs text-foreground mb-4 text-center">
        Your Chart
      </h2>
      <DialogueBox
        text={message}
        speed={20}
      />
      <div className="mt-6">
        <HaradaChartGrid
          chart={chart}
          highlightSubgoal={highlightSubgoal}
          compact
        />
      </div>
    </div>
  );
}
