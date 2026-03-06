"use client";

import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type StepAiFeedbackProps = {
  value: boolean;
  onChange: (enabled: boolean) => void;
};

export function StepAiFeedback({ value, onChange }: StepAiFeedbackProps) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl text-foreground mb-2">
        Would you like AI feedback?
      </h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When enabled, AI will review each of your subgoals and behaviors as you
        build your chart. After entering each subgoal, you&apos;ll see a rating
        (low/medium/high) on how well it supports your main goal, with
        suggestions for improvement. After entering behaviors, you&apos;ll get a
        per-behavior assessment of fit.
      </p>
      <p className="text-xs text-muted-foreground/70 mb-8 leading-relaxed">
        Your goal data is sent to OpenAI for analysis. You can always continue
        past any review.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
            value
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/40 hover:bg-muted/30"
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full transition-colors",
              value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <Sparkles className="size-5" />
          </div>
          <span className="text-sm font-medium">Yes, enable AI feedback</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "group relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
            !value
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/40 hover:bg-muted/30"
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full transition-colors",
              !value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <X className="size-5" />
          </div>
          <span className="text-sm font-medium">No thanks</span>
        </button>
      </div>
    </div>
  );
}
