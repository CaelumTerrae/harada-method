const SUBGOAL_COLOR = { bg: "bg-lime-100", border: "border-lime-300", text: "text-lime-900", accent: "bg-lime-200" } as const;

export const SUBGOAL_COLORS = Array.from({ length: 8 }, () => SUBGOAL_COLOR);

export type SubgoalColor = typeof SUBGOAL_COLOR;
