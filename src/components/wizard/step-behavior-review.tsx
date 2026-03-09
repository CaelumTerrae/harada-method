"use client";

import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { SUBGOAL_COLORS } from "@/lib/colors";
import type { BehaviorReview } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DialogueBox } from "@/components/dialogue-box";

type StepBehaviorReviewProps = {
  subgoalIndex: number;
  subgoalText: string;
  behaviors: string[];
  reviews: BehaviorReview[] | null;
  loading: boolean;
  error: string | null;
};

export function StepBehaviorReview({
  subgoalIndex,
  subgoalText,
  behaviors,
  reviews,
  loading,
  error,
}: StepBehaviorReviewProps) {
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
          Behavior Review
        </h2>
      </div>
      <p className={`text-sm font-medium mb-4 ${color.text}`}>
        For: {subgoalText}
      </p>

      {loading && (
        <>
          <DialogueBox
            text="Lemme check these behaviors... some of 'em better be good."
            speed={25}
          />
          <div className="flex items-center gap-3 mt-4 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Reviewing...</span>
          </div>
        </>
      )}

      {error && (
        <div className="dialogue-border bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && reviews && (
        <div className="space-y-3">
          {reviews.map((review) => {
            const behaviorText = behaviors[review.index]?.trim();
            if (!behaviorText) return null;

            return (
              <div
                key={review.index}
                className={cn(
                  "dialogue-border p-3",
                  review.fit
                    ? "bg-emerald-50/50"
                    : "bg-amber-50/50"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {review.fit ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {review.index + 1}. {behaviorText}
                    </p>
                    {review.feedback && (
                      <p className={cn(
                        "text-xs mt-1 leading-relaxed",
                        review.fit ? "text-emerald-700" : "text-amber-700"
                      )}>
                        {review.feedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <p className="font-pixel text-[8px] text-muted-foreground pt-2">
            AI feedback. You can continue regardless.
          </p>
        </div>
      )}
    </div>
  );
}
