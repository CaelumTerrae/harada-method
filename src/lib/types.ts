export type Subgoal = {
  id: string;
  text: string;
  behaviors: string[];
};

export type HaradaChart = {
  id: string;
  createdAt: string;
  mainGoal: string;
  subgoals: Subgoal[];
};

export type SubgoalReview = {
  rating: "low" | "medium" | "high";
  feedback: string;
};

export type BehaviorReview = {
  index: number;
  fit: boolean;
  feedback: string;
};
