"use client";

import type { HaradaChart } from "@/lib/types";
import { HaradaChartRegion } from "@/components/harada-chart-region";
import { DialogueBox } from "@/components/dialogue-box";

type StepChartPreviewProps = {
  chart: HaradaChart;
  region: "center" | number;
  message: string;
};

export function StepChartPreview({ chart, region, message }: StepChartPreviewProps) {
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
        <HaradaChartRegion
          chart={chart}
          region={region}
          compact
        />
      </div>
    </div>
  );
}
