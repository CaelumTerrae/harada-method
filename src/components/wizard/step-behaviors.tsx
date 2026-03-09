"use client";

import { Input } from "@/components/ui/input";
import { SUBGOAL_COLORS } from "@/lib/colors";
import { DialogueBox } from "@/components/dialogue-box";

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
          className={`inline-flex h-7 w-7 items-center justify-center text-xs font-pixel ${color.bg} ${color.text} border-2 border-foreground`}
        >
          {subgoalIndex + 1}
        </span>
        <h2 className="font-pixel text-xs text-foreground">
          Behaviors
        </h2>
      </div>
      <p className={`text-sm font-medium mb-4 ${color.text}`}>
        For: {subgoalText}
      </p>

      <DialogueBox
        text={`Now gimme 8 specific things you're gonna DO every day for "${subgoalText}". Be concrete — no wishy-washy stuff.`}
        speed={20}
      />

      <div className="grid gap-3 mt-6">
        {behaviors.map((behavior, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-pixel text-[8px] text-muted-foreground w-4 text-right shrink-0">
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
