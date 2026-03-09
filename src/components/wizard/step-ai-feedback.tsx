"use client";

import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogueBox } from "@/components/dialogue-box";

type StepAiFeedbackProps = {
  value: boolean;
  onChange: (enabled: boolean) => void;
};

export function StepAiFeedback({ value, onChange }: StepAiFeedbackProps) {
  return (
    <div>
      <DialogueBox
        text="Before we start, kid — you want me to get my buddy the AI to check your work? He'll rate your subgoals and behaviors as you go. Your call."
        speed={20}
      />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "group relative flex flex-col items-center gap-3 p-6 transition-all dialogue-border",
            value
              ? "bg-primary/10"
              : "bg-card hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-none border-2 border-foreground transition-colors",
              value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <Sparkles className="size-5" />
          </div>
          <span className="font-pixel text-[8px] leading-relaxed">Yes, enable AI</span>
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "group relative flex flex-col items-center gap-3 p-6 transition-all dialogue-border",
            !value
              ? "bg-primary/10"
              : "bg-card hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-none border-2 border-foreground transition-colors",
              !value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}
          >
            <X className="size-5" />
          </div>
          <span className="font-pixel text-[8px] leading-relaxed">No thanks</span>
        </button>
      </div>
    </div>
  );
}
