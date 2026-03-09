"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type DialogueBoxProps = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  showSprite?: boolean;
  spritePosition?: "left" | "right";
};

export function DialogueBox({
  text,
  speed = 25,
  onComplete,
  showSprite = true,
  spritePosition = "left",
}: DialogueBoxProps) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (text !== prevTextRef.current) {
      setDisplayedCount(0);
      setIsComplete(false);
      prevTextRef.current = text;
    }
  }, [text]);

  useEffect(() => {
    if (isComplete) return;

    intervalRef.current = setInterval(() => {
      setDisplayedCount((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsComplete(true);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, isComplete, onComplete]);

  const skipAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedCount(text.length);
    setIsComplete(true);
    onComplete?.();
  }, [text, onComplete]);

  const displayed = text.slice(0, displayedCount);

  const sprite = showSprite && (
    <div className="shrink-0">
      <Image
        src="/old-man.png"
        alt="Grumpy old man"
        width={96}
        height={96}
        className="pixelated"
        style={{ imageRendering: "pixelated" }}
        priority
      />
    </div>
  );

  return (
    <div
      className="flex items-start gap-4 cursor-pointer select-none"
      onClick={skipAnimation}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") skipAnimation();
      }}
    >
      {spritePosition === "left" && sprite}

      <div className="dialogue-border flex-1 min-w-0 bg-card p-4 relative">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {displayed}
          {!isComplete && (
            <span className="inline-block w-2 h-4 bg-foreground ml-0.5 animate-pulse" />
          )}
        </p>
        {isComplete && (
          <span className="absolute bottom-2 right-3 text-xs text-muted-foreground animate-bounce">
            &#9660;
          </span>
        )}
      </div>

      {spritePosition === "right" && sprite}
    </div>
  );
}
