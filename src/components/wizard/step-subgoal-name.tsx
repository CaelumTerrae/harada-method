"use client";

import { Input } from "@/components/ui/input";
import { SUBGOAL_COLORS } from "@/lib/colors";
import { DialogueBox } from "@/components/dialogue-box";

type StepSubgoalNameProps = {
  index: number;
  value: string;
  onChange: (value: string) => void;
};

const SUBGOAL_PROMPTS = [
  "First subgoal. What's one area you gotta work on to hit that big goal? Think fitness, skills, mindset — whatever matters.",
  "Number two. Give me another angle. What else do ya need to develop?",
  "Third one. You're getting the hang of it. Keep 'em distinct — don't repeat yourself.",
  "Subgoal four. We're halfway. What's another piece of the puzzle?",
  "Five. You better not be slacking. What else you got?",
  "Six outta eight. Almost there. Think about what you've been leaving out.",
  "Number seven. Dig deep, kid. What's something most people forget?",
  "Last one! Number eight. Make it count — what's the final piece?",
];

export function StepSubgoalName({ index, value, onChange }: StepSubgoalNameProps) {
  const color = SUBGOAL_COLORS[index];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center text-xs font-pixel ${color.bg} ${color.text} border-2 border-foreground`}
        >
          {index + 1}
        </span>
        <h2 className="font-pixel text-xs text-foreground">
          Subgoal {index + 1} of 8
        </h2>
      </div>

      <DialogueBox
        text={SUBGOAL_PROMPTS[index]}
        speed={20}
      />

      <div className="mt-6">
        <Input
          placeholder="e.g. Improve physical conditioning"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-center text-lg"
          autoFocus
        />
      </div>
    </div>
  );
}
