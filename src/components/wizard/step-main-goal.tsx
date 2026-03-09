"use client";

import { Input } from "@/components/ui/input";
import { DialogueBox } from "@/components/dialogue-box";

type StepMainGoalProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StepMainGoal({ value, onChange }: StepMainGoalProps) {
  return (
    <div>
      <DialogueBox
        text="Alright, what's the ONE big thing you wanna accomplish? Think big — this is the center of everything. Don't be a wimp about it."
        speed={20}
      />
      <div className="mt-6">
        <Input
          placeholder="e.g. Get drafted by an MLB team"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-center text-lg"
          autoFocus
        />
      </div>
    </div>
  );
}
