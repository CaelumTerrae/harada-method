"use client";

import type { HaradaChart } from "@/lib/types";
import { SUBGOAL_COLORS } from "@/lib/colors";

/**
 * The 9x9 grid is composed of nine 3x3 blocks arranged in a 3x3 meta-grid.
 *
 * Center block (meta row 1, col 1):
 *   [sg0] [sg1] [sg2]
 *   [sg3] [GOAL] [sg4]
 *   [sg5] [sg6] [sg7]
 *
 * Each subgoal index maps to an outer 3x3 block:
 *   sg0 -> meta(0,0)  sg1 -> meta(0,1)  sg2 -> meta(0,2)
 *   sg3 -> meta(1,0)                     sg4 -> meta(1,2)
 *   sg5 -> meta(2,0)  sg6 -> meta(2,1)  sg7 -> meta(2,2)
 *
 * Within each outer block, the subgoal text sits at the center,
 * and the 8 behaviors fill the surrounding positions.
 */

const SUBGOAL_TO_META: [number, number][] = [
  [0, 0], [0, 1], [0, 2],
  [1, 0],         [1, 2],
  [2, 0], [2, 1], [2, 2],
];

type CellData = {
  text: string;
  type: "goal" | "subgoal" | "behavior" | "empty";
  colorIndex: number;
};

function buildGrid(chart: HaradaChart): CellData[][] {
  const grid: CellData[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      text: "",
      type: "empty" as const,
      colorIndex: -1,
    }))
  );

  grid[4][4] = { text: chart.mainGoal, type: "goal", colorIndex: -1 };

  const centerPositions: [number, number][] = [
    [3, 3], [3, 4], [3, 5],
    [4, 3],         [4, 5],
    [5, 3], [5, 4], [5, 5],
  ];

  chart.subgoals.forEach((sg, sgIdx) => {
    const [cr, cc] = centerPositions[sgIdx];
    grid[cr][cc] = { text: sg.text, type: "subgoal", colorIndex: sgIdx };

    const [metaR, metaC] = SUBGOAL_TO_META[sgIdx];
    const baseR = metaR * 3;
    const baseC = metaC * 3;

    let behaviorIdx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const gr = baseR + r;
        const gc = baseC + c;
        if (r === 1 && c === 1) {
          grid[gr][gc] = { text: sg.text, type: "subgoal", colorIndex: sgIdx };
        } else {
          grid[gr][gc] = {
            text: sg.behaviors[behaviorIdx] || "",
            type: "behavior",
            colorIndex: sgIdx,
          };
          behaviorIdx++;
        }
      }
    }
  });

  return grid;
}

function getBlockForCell(r: number, c: number): string {
  return `${Math.floor(r / 3)}-${Math.floor(c / 3)}`;
}

function getHighlightedBlocks(highlightSubgoal: number): Set<string> {
  const blocks = new Set<string>();
  // The center block position in the center 3x3
  const centerPositions: [number, number][] = [
    [3, 3], [3, 4], [3, 5],
    [4, 3],         [4, 5],
    [5, 3], [5, 4], [5, 5],
  ];
  // Always highlight the center block (where the subgoal label lives)
  blocks.add("1-1");
  // Also highlight the outer block for this subgoal
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
