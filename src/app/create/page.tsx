"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useHaradaStore } from "@/lib/store";
import type { HaradaChart, Subgoal, SubgoalReview, BehaviorReview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { WizardProgressBar } from "@/components/wizard/progress-bar";
import { StepAiFeedback } from "@/components/wizard/step-ai-feedback";
import { StepMainGoal } from "@/components/wizard/step-main-goal";
import { StepSubgoalName } from "@/components/wizard/step-subgoal-name";
import { StepBehaviors } from "@/components/wizard/step-behaviors";
import { StepSubgoalReview } from "@/components/wizard/step-subgoal-review";
import { StepBehaviorReview } from "@/components/wizard/step-behavior-review";
import { StepChartPreview } from "@/components/wizard/step-chart-preview";
import { HaradaChartRegion } from "@/components/harada-chart-region";
import { useIsMobile } from "@/hooks/use-mobile";

function createEmptySubgoals(): Subgoal[] {
  return Array.from({ length: 8 }, () => ({
    id: nanoid(8),
    text: "",
    behaviors: Array(8).fill(""),
  }));
}

type StepDescriptor =
  | { phase: "ai-feedback"; sgIdx: -1 }
  | { phase: "goal"; sgIdx: -1 }
  | { phase: "subgoals"; sgIdx: number }
  | { phase: "subgoal-review"; sgIdx: number }
  | { phase: "behaviors"; sgIdx: number }
  | { phase: "behavior-review"; sgIdx: number };

function buildSteps(aiFeedback: boolean): StepDescriptor[] {
  const steps: StepDescriptor[] = [
    { phase: "ai-feedback", sgIdx: -1 },
    { phase: "goal", sgIdx: -1 },
  ];

  for (let i = 0; i < 8; i++) {
    steps.push({ phase: "subgoals", sgIdx: i });
    if (aiFeedback) {
      steps.push({ phase: "subgoal-review", sgIdx: i });
    }
  }

  for (let i = 0; i < 8; i++) {
    steps.push({ phase: "behaviors", sgIdx: i });
    if (aiFeedback) {
      steps.push({ phase: "behavior-review", sgIdx: i });
    }
  }

  return steps;
}

export default function CreatePage() {
  const router = useRouter();
  const addChart = useHaradaStore((s) => s.addChart);
  const aiFeedback = useHaradaStore((s) => s.aiFeedback);
  const setAiFeedback = useHaradaStore((s) => s.setAiFeedback);
  const isMobile = useIsMobile();

  const [step, setStep] = useState(0);
  const [mainGoal, setMainGoal] = useState("");
  const [subgoals, setSubgoals] = useState<Subgoal[]>(createEmptySubgoals);
  const [animating, setAnimating] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const [subgoalReviews, setSubgoalReviews] = useState<Record<number, SubgoalReview | null>>({});
  const [behaviorReviews, setBehaviorReviews] = useState<Record<number, BehaviorReview[] | null>>({});
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const steps = useMemo(() => buildSteps(aiFeedback), [aiFeedback]);
  const totalSteps = steps.length;
  const currentStep = steps[step];
  const { phase, sgIdx } = currentStep;

  const updateSubgoalText = useCallback(
    (index: number, value: string) => {
      setSubgoals((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], text: value };
        return next;
      });
    },
    []
  );

  const updateBehavior = useCallback(
    (subgoalIndex: number, behaviorIndex: number, value: string) => {
      setSubgoals((prev) => {
        const next = [...prev];
        const behaviors = [...next[subgoalIndex].behaviors];
        behaviors[behaviorIndex] = value;
        next[subgoalIndex] = { ...next[subgoalIndex], behaviors };
        return next;
      });
    },
    []
  );

  const canAdvance = showMobilePreview
    ? true
    : phase === "ai-feedback"
      ? true
      : phase === "goal"
        ? mainGoal.trim().length > 0
        : phase === "subgoals"
          ? subgoals[sgIdx]?.text.trim().length > 0
          : phase === "subgoal-review"
            ? !reviewLoading
            : phase === "behavior-review"
              ? !reviewLoading
              : true;

  const transition = (fn: () => void) => {
    setAnimating(true);
    setTimeout(() => {
      fn();
      setAnimating(false);
    }, 150);
  };

  const isGoalStep = phase === "goal";
  const isLastSubgoalStep = phase === "subgoals" && sgIdx === 7;
  const isLastSubgoalReviewStep = phase === "subgoal-review" && sgIdx === 7;
  const isMobilePreviewCheckpoint =
    isMobile && (isGoalStep || (aiFeedback ? isLastSubgoalReviewStep : isLastSubgoalStep));

  const fetchSubgoalReview = useCallback(
    async (subgoalIndex: number) => {
      setReviewLoading(true);
      setReviewError(null);
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subgoal",
            mainGoal: mainGoal.trim(),
            subgoalText: subgoals[subgoalIndex].text.trim(),
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to get AI review");
        }
        const data: SubgoalReview = await res.json();
        setSubgoalReviews((prev) => ({ ...prev, [subgoalIndex]: data }));
      } catch (e) {
        setReviewError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setReviewLoading(false);
      }
    },
    [mainGoal, subgoals]
  );

  const fetchBehaviorReview = useCallback(
    async (subgoalIndex: number) => {
      setReviewLoading(true);
      setReviewError(null);
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "behaviors",
            mainGoal: mainGoal.trim(),
            subgoalText: subgoals[subgoalIndex].text.trim(),
            behaviors: subgoals[subgoalIndex].behaviors,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to get AI review");
        }
        const data = await res.json();
        setBehaviorReviews((prev) => ({ ...prev, [subgoalIndex]: data.reviews }));
      } catch (e) {
        setReviewError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setReviewLoading(false);
      }
    },
    [mainGoal, subgoals]
  );

  useEffect(() => {
    if (phase === "subgoal-review" && !subgoalReviews[sgIdx] && !reviewLoading) {
      fetchSubgoalReview(sgIdx);
    }
    if (phase === "behavior-review" && !behaviorReviews[sgIdx] && !reviewLoading) {
      fetchBehaviorReview(sgIdx);
    }
  }, [phase, sgIdx, subgoalReviews, behaviorReviews, reviewLoading, fetchSubgoalReview, fetchBehaviorReview]);

  const handleNext = () => {
    if (isMobilePreviewCheckpoint && !showMobilePreview) {
      transition(() => setShowMobilePreview(true));
      return;
    }

    if (showMobilePreview) {
      transition(() => {
        setShowMobilePreview(false);
        setStep(step + 1);
      });
      return;
    }

    if (step < totalSteps - 1) {
      transition(() => setStep(step + 1));
    } else {
      const id = addChart(mainGoal.trim(), subgoals);
      router.push(`/chart/${id}`);
    }
  };

  const handleBack = () => {
    if (showMobilePreview) {
      transition(() => setShowMobilePreview(false));
      return;
    }
    if (step > 0) {
      transition(() => setStep(step - 1));
    }
  };

  const partialChart: HaradaChart = useMemo(
    () => ({
      id: "preview",
      createdAt: "",
      mainGoal,
      subgoals,
    }),
    [mainGoal, subgoals]
  );

  const previewRegion: "center" | number =
    phase === "behaviors" || phase === "behavior-review"
      ? sgIdx
      : "center";

  const showGoalLabel = phase !== "ai-feedback" && phase !== "goal";

  const mobilePreviewMessage = isGoalStep
    ? "There's your chart with your big goal in the middle. Now we're gonna fill in 8 subgoals around it. Keep up!"
    : "Not bad, kid! All 8 subgoals are locked in. Now comes the real work — 8 behaviors for each one. Let's go.";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12 lg:max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to home
          </Link>
          {showGoalLabel && (
            <p className="font-pixel text-[8px] text-muted-foreground/60 truncate max-w-xs">
              Goal: <span className="text-foreground/60">{mainGoal}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left column: wizard form */}
          <div className="w-full lg:w-[420px] lg:shrink-0">
            <WizardProgressBar currentStep={step} totalSteps={totalSteps} phase={phase} subgoalIndex={sgIdx} />

            <div
              className={`min-h-[200px] transition-opacity duration-150 ${
                animating ? "opacity-0" : "opacity-100"
              }`}
            >
              {showMobilePreview ? (
                <StepChartPreview
                  chart={partialChart}
                  region="center"
                  message={mobilePreviewMessage}
                />
              ) : (
                <>
                  {phase === "ai-feedback" && (
                    <StepAiFeedback value={aiFeedback} onChange={setAiFeedback} />
                  )}
                  {phase === "goal" && (
                    <StepMainGoal value={mainGoal} onChange={setMainGoal} />
                  )}
                  {phase === "subgoals" && (
                    <StepSubgoalName
                      key={sgIdx}
                      index={sgIdx}
                      value={subgoals[sgIdx].text}
                      onChange={(v) => updateSubgoalText(sgIdx, v)}
                    />
                  )}
                  {phase === "subgoal-review" && (
                    <StepSubgoalReview
                      key={sgIdx}
                      subgoalIndex={sgIdx}
                      subgoalText={subgoals[sgIdx].text}
                      review={subgoalReviews[sgIdx] ?? null}
                      loading={reviewLoading}
                      error={reviewError}
                    />
                  )}
                  {phase === "behaviors" && (
                    <StepBehaviors
                      key={sgIdx}
                      subgoalIndex={sgIdx}
                      subgoalText={subgoals[sgIdx].text}
                      behaviors={subgoals[sgIdx].behaviors}
                      onBehaviorChange={(bi, v) => updateBehavior(sgIdx, bi, v)}
                    />
                  )}
                  {phase === "behavior-review" && (
                    <StepBehaviorReview
                      key={sgIdx}
                      subgoalIndex={sgIdx}
                      subgoalText={subgoals[sgIdx].text}
                      behaviors={subgoals[sgIdx].behaviors}
                      reviews={behaviorReviews[sgIdx] ?? null}
                      loading={reviewLoading}
                      error={reviewError}
                    />
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="sticky bottom-0 bg-background pt-4 pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 border-t border-border/40 lg:static lg:mx-0 lg:px-0 lg:mt-10 lg:pt-6 lg:pb-0">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 0 && !showMobilePreview}
                  className="text-muted-foreground"
                >
                  &larr; Back
                </Button>
                <Button onClick={handleNext} disabled={!canAdvance} size="lg" className="font-pixel text-[10px]">
                  {step === totalSteps - 1 ? "Complete Chart" : "Continue \u2192"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right column: live chart preview (hidden on mobile) */}
          {!isMobile && phase !== "ai-feedback" && (
            <div className="flex-1 min-w-0">
              <p className="font-pixel text-[8px] uppercase tracking-widest text-muted-foreground mb-4">
                Live Preview
              </p>
              <HaradaChartRegion
                chart={partialChart}
                region={previewRegion}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
