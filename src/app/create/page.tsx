"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { nanoid } from "nanoid";
import { useHaradaStore } from "@/lib/store";
import type { HaradaChart, Subgoal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { WizardProgressBar } from "@/components/wizard/progress-bar";
import { StepMainGoal } from "@/components/wizard/step-main-goal";
import { StepSubgoalName } from "@/components/wizard/step-subgoal-name";
import { StepBehaviors } from "@/components/wizard/step-behaviors";
import { HaradaChartGrid } from "@/components/harada-chart";
import { useIsMobile } from "@/hooks/use-mobile";

const TOTAL_STEPS = 17;

function createEmptySubgoals(): Subgoal[] {
  return Array.from({ length: 8 }, () => ({
    id: nanoid(8),
    text: "",
    behaviors: Array(8).fill(""),
  }));
}

type Phase = "goal" | "subgoals" | "behaviors";

function getPhase(step: number): Phase {
  if (step === 0) return "goal";
  if (step <= 8) return "subgoals";
  return "behaviors";
}

function getSubgoalIndex(step: number): number {
  const phase = getPhase(step);
  if (phase === "subgoals") return step - 1;
  if (phase === "behaviors") return step - 9;
  return -1;
}

export default function CreatePage() {
  const router = useRouter();
  const addChart = useHaradaStore((s) => s.addChart);
  const isMobile = useIsMobile();

  const [step, setStep] = useState(0);
  const [mainGoal, setMainGoal] = useState("");
  const [subgoals, setSubgoals] = useState<Subgoal[]>(createEmptySubgoals);
  const [animating, setAnimating] = useState(false);

  const phase = getPhase(step);
  const sgIdx = getSubgoalIndex(step);

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

  const canAdvance =
    phase === "goal"
      ? mainGoal.trim().length > 0
      : phase === "subgoals"
        ? subgoals[sgIdx]?.text.trim().length > 0
        : true;

  const transition = (fn: () => void) => {
    setAnimating(true);
    setTimeout(() => {
      fn();
      setAnimating(false);
    }, 150);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      transition(() => setStep(step + 1));
    } else {
      const id = addChart(mainGoal.trim(), subgoals);
      router.push(`/chart/${id}`);
    }
  };

  const handleBack = () => {
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

  const highlightSubgoal = phase === "subgoals" || phase === "behaviors" ? sgIdx : undefined;

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
          {step > 0 && (
            <p className="text-xs text-muted-foreground/60 font-medium truncate max-w-xs">
              Goal: <span className="text-foreground/60">{mainGoal}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left column: wizard form */}
          <div className="w-full lg:w-[420px] lg:shrink-0">
            <WizardProgressBar currentStep={step} totalSteps={TOTAL_STEPS} phase={phase} subgoalIndex={sgIdx} />

            <div
              className={`min-h-[420px] transition-opacity duration-150 ${
                animating ? "opacity-0" : "opacity-100"
              }`}
            >
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
              {phase === "behaviors" && (
                <StepBehaviors
                  key={sgIdx}
                  subgoalIndex={sgIdx}
                  subgoalText={subgoals[sgIdx].text}
                  behaviors={subgoals[sgIdx].behaviors}
                  onBehaviorChange={(bi, v) => updateBehavior(sgIdx, bi, v)}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/40">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 0}
                className="text-muted-foreground"
              >
                &larr; Back
              </Button>
              <Button onClick={handleNext} disabled={!canAdvance} size="lg">
                {step === TOTAL_STEPS - 1 ? "Complete Chart" : "Continue \u2192"}
              </Button>
            </div>
          </div>

          {/* Right column: live chart preview (hidden on mobile) */}
          {!isMobile && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Live Preview
              </p>
              <HaradaChartGrid
                chart={partialChart}
                highlightSubgoal={highlightSubgoal}
                compact
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
