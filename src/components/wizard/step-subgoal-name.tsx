"use client";

import { Input } from "@/components/ui/input";
import { SUBGOAL_COLORS } from "@/lib/colors";

type StepSubgoalNameProps = {
  index: number;
  value: string;
  onChange: (value: string) => void;
};

export function StepSubgoalName({ index, value, onChange }: StepSubgoalNameProps) {
  const color = SUBGOAL_COLORS[index];

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${color.bg} ${color.text}`}
        >
          {index + 1}
        </span>
        <h2 className="font-serif text-3xl text-foreground">
          Subgoal {index + 1} of 8
        </h2>
      </div>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        What area of focus will support your main goal? Think about a distinct
        category — fitness, knowledge, relationships, mindset — that you need
        to develop.
      </p>
      <Input
        placeholder="e.g. Improve physical conditioning"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-center text-lg"
        autoFocus
      />
    </div>
  );
}
