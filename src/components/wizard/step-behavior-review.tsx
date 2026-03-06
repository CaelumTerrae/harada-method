"use client";

import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { SUBGOAL_COLORS } from "@/lib/colors";
import type { BehaviorReview } from "@/lib/types";
import { cn } from "@/lib/utils";

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
          className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${color.bg} ${color.text}`}
        >
          {subgoalIndex + 1}
        </span>
        <h2 className="font-serif text-2xl text-foreground">
          Behavior Review
        </h2>
      </div>
      <p className={`text-sm font-medium mb-6 ${color.text}`}>
        For: {subgoalText}
      </p>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-10">
          <Loader2 className="size-8 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Reviewing your behaviors...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
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
                  "rounded-lg border p-3",
                  review.fit
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-amber-200 bg-amber-50/50"
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

          <p className="text-xs text-muted-foreground pt-2">
            This is AI-generated feedback. You can continue regardless of the results.
          </p>
        </div>
      )}
    </div>
  );
}
