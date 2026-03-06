"use client";

import { Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { SUBGOAL_COLORS } from "@/lib/colors";
import type { SubgoalReview } from "@/lib/types";
import { cn } from "@/lib/utils";

type StepSubgoalReviewProps = {
  subgoalIndex: number;
  subgoalText: string;
  review: SubgoalReview | null;
  loading: boolean;
  error: string | null;
};

const RATING_CONFIG = {
  high: {
    icon: CheckCircle2,
    label: "Great fit",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    iconColor: "text-emerald-600",
  },
  medium: {
    icon: AlertTriangle,
    label: "Could improve",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    iconColor: "text-amber-600",
  },
  low: {
    icon: XCircle,
    label: "Needs work",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
    iconColor: "text-red-600",
  },
} as const;

export function StepSubgoalReview({
  subgoalIndex,
  subgoalText,
  review,
  loading,
  error,
}: StepSubgoalReviewProps) {
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
          Subgoal Review
        </h2>
      </div>
      <p className={`text-sm font-medium mb-6 ${color.text}`}>
        {subgoalText}
      </p>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-10">
          <Loader2 className="size-8 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Analyzing your subgoal...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && review && (
        <div className="space-y-4">
          <RatingBadge rating={review.rating} />
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-foreground leading-relaxed">
              {review.feedback}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            This is AI-generated feedback. You can continue regardless of the rating.
          </p>
        </div>
      )}
    </div>
  );
}

function RatingBadge({ rating }: { rating: SubgoalReview["rating"] }) {
  const config = RATING_CONFIG[rating];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2", config.badgeBg)}>
      <Icon className={cn("size-4", config.iconColor)} />
      <span className={cn("text-sm font-semibold", config.badgeText)}>
        {config.label}
      </span>
    </div>
  );
}
