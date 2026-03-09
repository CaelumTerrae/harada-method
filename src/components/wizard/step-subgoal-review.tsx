"use client";

import { Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { SUBGOAL_COLORS } from "@/lib/colors";
import type { SubgoalReview } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DialogueBox } from "@/components/dialogue-box";

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
          className={`inline-flex h-7 w-7 items-center justify-center text-xs font-pixel ${color.bg} ${color.text} border-2 border-foreground`}
        >
          {subgoalIndex + 1}
        </span>
        <h2 className="font-pixel text-xs text-foreground">
          Subgoal Review
        </h2>
      </div>
      <p className={`text-sm font-medium mb-4 ${color.text}`}>
        {subgoalText}
      </p>

      {loading && (
        <DialogueBox
          text="Hold on... lemme get the AI to take a look at this..."
          speed={30}
          showSprite={true}
        />
      )}

      {loading && (
        <div className="flex items-center gap-3 mt-4 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Analyzing...</span>
        </div>
      )}

      {error && (
        <div className="dialogue-border bg-red-50 p-4 mt-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!loading && !error && review && (
        <div className="space-y-4">
          <DialogueBox
            text={review.feedback}
            speed={15}
          />
          <div className="mt-4">
            <RatingBadge rating={review.rating} />
          </div>
          <p className="font-pixel text-[8px] text-muted-foreground">
            AI feedback. You can continue regardless.
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
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 border-2 border-foreground", config.badgeBg)}>
      <Icon className={cn("size-4", config.iconColor)} />
      <span className={cn("font-pixel text-[8px]", config.badgeText)}>
        {config.label}
      </span>
    </div>
  );
}
