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
