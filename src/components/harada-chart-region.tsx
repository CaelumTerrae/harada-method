"use client";

import type { HaradaChart } from "@/lib/types";
import { SUBGOAL_COLORS } from "@/lib/colors";
import { buildGrid, extractBlock, SUBGOAL_TO_META } from "@/lib/grid-utils";

type HaradaChartRegionProps = {
  chart: HaradaChart;
  region: "center" | number;
  compact?: boolean;
};

export function HaradaChartRegion({ chart, region, compact }: HaradaChartRegionProps) {
  const fullGrid = buildGrid(chart);

  const block =
    region === "center"
      ? extractBlock(fullGrid, 1, 1)
      : extractBlock(fullGrid, ...SUBGOAL_TO_META[region]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 shadow-sm">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        {block.flatMap((row, r) =>
          row.map((cell, c) => {
            const color =
              cell.colorIndex >= 0 ? SUBGOAL_COLORS[cell.colorIndex] : null;

            const isGoal = cell.type === "goal";
            const isSubgoal = cell.type === "subgoal";

            let bgClass = "bg-green-50/40";
            if (isGoal) {
              bgClass = "bg-[#5a4630]";
            } else if (isSubgoal && color) {
              bgClass = color.accent;
            } else if (color) {
              bgClass = color.bg;
            }

            const textClass = isGoal
              ? `text-white font-pixel ${compact ? "text-[7px]" : "text-[9px]"} leading-snug`
              : isSubgoal
                ? `${color?.text ?? "text-foreground"} font-pixel ${compact ? "text-[6px]" : "text-[8px]"} leading-snug`
                : `${color?.text ?? "text-muted-foreground"} ${compact ? "text-[9px]" : "text-[11px]"} leading-tight`;

            return (
              <div
                key={`${r}-${c}`}
                className={[
                  "aspect-square",
                  bgClass,
                  textClass,
                  `flex items-center justify-center text-center ${compact ? "p-1" : "p-2"}`,
                  "border-r border-b border-stone-300",
                  c === 2 ? "border-r-stone-300" : "",
                  r === 2 ? "border-b-stone-300" : "",
                  c === 0 ? "border-l border-l-stone-300" : "",
                  r === 0 ? "border-t border-t-stone-300" : "",
                ].join(" ")}
              >
                <span className={`break-words hyphens-auto max-w-full ${compact ? "line-clamp-4" : "line-clamp-5"}`}>
                  {cell.text}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
