"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SUBGOAL_COLORS } from "@/lib/colors";
import { DialogueBox } from "@/components/dialogue-box";

type StepBehaviorsProps = {
  subgoalIndex: number;
  subgoalText: string;
  behaviors: string[];
  onBehaviorChange: (behaviorIndex: number, value: string) => void;
  aiFeedback?: boolean;
  onGenerateBehaviors?: () => void;
  generating?: boolean;
};

export function StepBehaviors({
  subgoalIndex,
  subgoalText,
  behaviors,
  onBehaviorChange,
  aiFeedback = false,
  onGenerateBehaviors,
  generating = false,
}: StepBehaviorsProps) {
  const color = SUBGOAL_COLORS[subgoalIndex];
  const [aiGenerated, setAiGenerated] = useState(false);
  const wasGenerating = useRef(false);

  useEffect(() => {
    if (wasGenerating.current && !generating) {
      setAiGenerated(true);
    }
    wasGenerating.current = generating;
  }, [generating]);

  const dialogueText = generating
    ? "Hold on, let me ask my AI buddy to think up some behaviors for ya..."
    : aiGenerated
      ? "There ya go, kid! My AI buddy cooked up some ideas. Don't just sit there — tweak 'em to make 'em yours."
      : `Now gimme 8 specific things you're gonna DO every day for "${subgoalText}". Be concrete — no wishy-washy stuff.`;

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
        text={dialogueText}
        speed={20}
      />

      {aiFeedback && onGenerateBehaviors && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateBehaviors}
            disabled={generating}
            className="font-pixel text-[9px] gap-1.5"
          >
            {generating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {generating ? "Thinking..." : "Let AI take a crack at it"}
          </Button>
        </div>
      )}

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
