const SUBGOAL_COLOR = { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-900", accent: "bg-amber-200" } as const;

export const SUBGOAL_COLORS = Array.from({ length: 8 }, () => SUBGOAL_COLOR);

export type SubgoalColor = typeof SUBGOAL_COLOR;
