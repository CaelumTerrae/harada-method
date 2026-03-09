"use client";

import type { HaradaChart } from "@/lib/types";
import { SUBGOAL_COLORS } from "@/lib/colors";
import { buildGrid, SUBGOAL_TO_META } from "@/lib/grid-utils";

function getBlockForCell(r: number, c: number): string {
  return `${Math.floor(r / 3)}-${Math.floor(c / 3)}`;
}

function getHighlightedBlocks(highlightSubgoal: number): Set<string> {
  const blocks = new Set<string>();
  blocks.add("1-1");
  const [metaR, metaC] = SUBGOAL_TO_META[highlightSubgoal];
  blocks.add(`${metaR}-${metaC}`);
  return blocks;
}

type HaradaChartGridProps = {
  chart: HaradaChart;
  highlightSubgoal?: number;
  compact?: boolean;
};

export function HaradaChartGrid({ chart, highlightSubgoal, compact }: HaradaChartGridProps) {
  const grid = buildGrid(chart);
  const highlightedBlocks =
    highlightSubgoal !== undefined ? getHighlightedBlocks(highlightSubgoal) : null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60 shadow-sm">
      <div
        className={`grid ${compact ? "min-w-[360px]" : "min-w-[760px]"}`}
        style={{
          gridTemplateColumns: "repeat(9, minmax(0, 1fr))",
          gridTemplateRows: `repeat(9, minmax(${compact ? "48px" : "72px"}, auto))`,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((cell, c) => {
            const color =
              cell.colorIndex >= 0 ? SUBGOAL_COLORS[cell.colorIndex] : null;

            const isGoal = cell.type === "goal";
            const isSubgoal = cell.type === "subgoal";

            const blockKey = getBlockForCell(r, c);
            const isInHighlightedBlock = highlightedBlocks?.has(blockKey) ?? false;
            const isDimmed = highlightedBlocks !== null && !isInHighlightedBlock;

            let bgClass = "bg-green-50/40";
            if (isGoal) {
              bgClass = "bg-[#5a4630]";
            } else if (isSubgoal && color) {
              bgClass = color.accent;
            } else if (color) {
              bgClass = color.bg;
            }

            const textClass = isGoal
              ? `text-white font-pixel ${compact ? "text-[6px]" : "text-[8px]"} leading-snug`
              : isSubgoal
                ? `${color?.text ?? "text-foreground"} font-pixel ${compact ? "text-[5px]" : "text-[7px]"} leading-snug`
                : `${color?.text ?? "text-muted-foreground"} ${compact ? "text-[7px]" : "text-[10px]"} leading-tight`;

            const isBlockBorderR = (c + 1) % 3 === 0 && c < 8;
            const isBlockBorderB = (r + 1) % 3 === 0 && r < 8;

            return (
              <div
                key={`${r}-${c}`}
                className={[
                  bgClass,
                  textClass,
                  `flex items-center justify-center text-center ${compact ? "p-0.5" : "p-1.5"}`,
                  "border-r border-b border-stone-300",
                  isBlockBorderR ? "border-r-stone-400" : "",
                  isBlockBorderB ? "border-b-stone-400" : "",
                  c === 0 ? "border-l border-l-stone-300" : "",
                  r === 0 ? "border-t border-t-stone-300" : "",
                  isDimmed ? "opacity-30" : "",
                  isInHighlightedBlock ? "transition-opacity duration-300" : "",
                ].join(" ")}
              >
                <span className={`break-words hyphens-auto max-w-full ${compact ? "line-clamp-3" : "line-clamp-4"}`}>
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
