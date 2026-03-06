"use client";

import { Input } from "@/components/ui/input";
import { SUBGOAL_COLORS } from "@/lib/colors";

type StepBehaviorsProps = {
  subgoalIndex: number;
  subgoalText: string;
  behaviors: string[];
  onBehaviorChange: (behaviorIndex: number, value: string) => void;
};

export function StepBehaviors({
  subgoalIndex,
  subgoalText,
  behaviors,
  onBehaviorChange,
}: StepBehaviorsProps) {
  const color = SUBGOAL_COLORS[subgoalIndex];

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${color.bg} ${color.text}`}
        >
          {subgoalIndex + 1}
        </span>
        <h2 className="font-serif text-2xl text-foreground">
          Behaviors
        </h2>
      </div>
      <p className={`text-sm font-medium mb-4 ${color.text}`}>
        For: {subgoalText}
      </p>
      <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
        List 8 specific, repeatable actions or habits that will help you
        achieve this subgoal. Be concrete — these are the daily building blocks.
      </p>

      <div className="grid gap-3">
        {behaviors.map((behavior, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-4 text-right shrink-0">
              {i + 1}
            </span>
            <Input
              placeholder={`Behavior ${i + 1}`}
              value={behavior}
              onChange={(e) => onBehaviorChange(i, e.target.value)}
              className="text-sm"
              autoFocus={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
