"use client";

import { useEffect, useState } from "react";
import { ActivityLine } from "./activity-line";
import { useReducedMotion } from "./use-reduced-motion";

type ActivityTypewriterProps = {
  prefix: string;
  activities: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
};

export function ActivityTypewriter({
  prefix,
  activities,
  typingSpeed = 45,
  deletingSpeed = 28,
  pauseMs = 2200,
}: ActivityTypewriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activityIndex, setActivityIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (activities.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      const interval = window.setInterval(() => {
        setActivityIndex((current) => (current + 1) % activities.length);
      }, 3500);

      return () => window.clearInterval(interval);
    }

    const currentActivity = activities[activityIndex];

    if (!isDeleting && displayText === currentActivity) {
      const timeout = window.setTimeout(() => setIsDeleting(true), pauseMs);
      return () => window.clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setActivityIndex((current) => (current + 1) % activities.length);
      return;
    }

    const timeout = window.setTimeout(
      () => {
        const nextLength = isDeleting
          ? displayText.length - 1
          : displayText.length + 1;
        setDisplayText(currentActivity.slice(0, nextLength));
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [
    activities,
    activityIndex,
    deletingSpeed,
    displayText,
    isDeleting,
    pauseMs,
    prefersReducedMotion,
    typingSpeed,
  ]);

  const visibleText = prefersReducedMotion
    ? activities[activityIndex]
    : displayText;

  return (
    <ActivityLine prefix={prefix}>
      <span>{visibleText}</span>
      <span
        aria-hidden
        className={`ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-0.5 bg-foreground ${
          prefersReducedMotion ? "opacity-0" : "animate-pulse"
        }`}
      />
    </ActivityLine>
  );
}
