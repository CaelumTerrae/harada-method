"use client";

type Phase = "ai-feedback" | "goal" | "subgoals" | "subgoal-review" | "behaviors" | "behavior-review";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  phase: Phase;
  subgoalIndex: number;
};

function getPhaseLabel(phase: Phase, subgoalIndex: number): string {
  if (phase === "ai-feedback") return "Getting Started";
  if (phase === "goal") return "Main Goal";
  if (phase === "subgoals") return `Subgoal ${subgoalIndex + 1} of 8`;
  if (phase === "subgoal-review") return `Subgoal ${subgoalIndex + 1} Review`;
  if (phase === "behaviors") return `Behaviors for Subgoal ${subgoalIndex + 1} of 8`;
  return `Behavior Review for Subgoal ${subgoalIndex + 1}`;
}

export function WizardProgressBar({ currentStep, totalSteps, phase, subgoalIndex }: ProgressBarProps) {
  const pct = ((currentStep + 1) / totalSteps) * 100;
  const label = getPhaseLabel(phase, subgoalIndex);
  const filledSegments = Math.round((pct / 100) * 20);

  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-pixel text-[8px] text-foreground">
          {label}
        </p>
        <p className="font-pixel text-[8px] text-muted-foreground">
          {Math.round(pct)}%
        </p>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 border border-foreground/30 ${
              i < filledSegments ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
