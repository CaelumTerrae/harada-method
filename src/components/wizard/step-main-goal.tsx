"use client";

import { Input } from "@/components/ui/input";

type StepMainGoalProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StepMainGoal({ value, onChange }: StepMainGoalProps) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl text-foreground mb-2">
        What is your main goal?
      </h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        This is the single ambitious goal at the center of your Harada chart.
        Think big — everything else will build toward this.
      </p>
      <Input
        placeholder="e.g. Get drafted by an MLB team"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-center text-lg"
        autoFocus
      />
    </div>
  );
}
