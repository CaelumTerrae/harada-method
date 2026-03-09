import type { HaradaChart } from "@/lib/types";

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

export const SUBGOAL_TO_META: [number, number][] = [
  [0, 0], [0, 1], [0, 2],
  [1, 0],         [1, 2],
  [2, 0], [2, 1], [2, 2],
];

export type CellData = {
  text: string;
  type: "goal" | "subgoal" | "behavior" | "empty";
  colorIndex: number;
};

export function buildGrid(chart: HaradaChart): CellData[][] {
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

export function extractBlock(grid: CellData[][], metaRow: number, metaCol: number): CellData[][] {
  const baseR = metaRow * 3;
  const baseC = metaCol * 3;
  return [
    [grid[baseR][baseC], grid[baseR][baseC + 1], grid[baseR][baseC + 2]],
    [grid[baseR + 1][baseC], grid[baseR + 1][baseC + 1], grid[baseR + 1][baseC + 2]],
    [grid[baseR + 2][baseC], grid[baseR + 2][baseC + 1], grid[baseR + 2][baseC + 2]],
  ];
}
