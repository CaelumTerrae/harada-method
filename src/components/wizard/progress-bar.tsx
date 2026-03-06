"use client";

import { Progress } from "@/components/ui/progress";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  phase: "goal" | "subgoals" | "behaviors";
  subgoalIndex: number;
};

function getPhaseLabel(phase: ProgressBarProps["phase"], subgoalIndex: number): string {
  if (phase === "goal") return "Main Goal";
  if (phase === "subgoals") return `Subgoal ${subgoalIndex + 1} of 8`;
  return `Behaviors for Subgoal ${subgoalIndex + 1} of 8`;
}

export function WizardProgressBar({ currentStep, totalSteps, phase, subgoalIndex }: ProgressBarProps) {
  const pct = ((currentStep + 1) / totalSteps) * 100;
  const label = getPhaseLabel(phase, subgoalIndex);

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-medium text-foreground">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.round(pct)}% complete
        </p>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
