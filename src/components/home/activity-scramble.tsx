"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityLine } from "./activity-line";
import { useReducedMotion } from "./use-reduced-motion";

type ActivityScrambleProps = {
  prefix: string;
  activities: string[];
  holdMs?: number;
  decodeMs?: number;
  encodeMs?: number;
};

const SCRAMBLE_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function scrambleText(target: string, progress: number, tick: number) {
  if (progress >= 1) {
    return target;
  }

  const length = Math.max(target.length, 1);

  return target
    .split("")
    .map((character, index) => {
      if (character === " ") {
        return " ";
      }

      const revealAt = (index + 1) / length;
      if (progress >= revealAt) {
        return character;
      }

      const seed = index * 97 + tick * 13;
      return SCRAMBLE_CHARSET[Math.abs(seed) % SCRAMBLE_CHARSET.length];
    })
    .join("");
}

export function ActivityScramble({
  prefix,
  activities,
  holdMs = 2600,
  decodeMs = 1250,
  encodeMs = 950,
}: ActivityScrambleProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activityIndex, setActivityIndex] = useState(0);
  const [displayText, setDisplayText] = useState(activities[0] ?? "");
  const scrambleTickRef = useRef(0);

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
    let frame = 0;
    let phase: "in" | "hold" | "out" = "in";
    let start = performance.now();
    let lastScrambleTick = start;

    const tick = (now: number) => {
      if (now - lastScrambleTick >= 48) {
        scrambleTickRef.current += 1;
        lastScrambleTick = now;
      }

      if (phase === "in") {
        const progress = Math.min((now - start) / decodeMs, 1);
        setDisplayText(
          scrambleText(currentActivity, progress, scrambleTickRef.current),
        );

        if (progress >= 1) {
          setDisplayText(currentActivity);
          phase = "hold";
          start = now;
        }
      } else if (phase === "hold") {
        if (now - start >= holdMs) {
          phase = "out";
          start = now;
        }
      } else {
        const progress = 1 - Math.min((now - start) / encodeMs, 1);
        setDisplayText(
          scrambleText(currentActivity, progress, scrambleTickRef.current),
        );

        if (progress <= 0) {
          setActivityIndex((current) => (current + 1) % activities.length);
          return;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activities, activityIndex, decodeMs, encodeMs, holdMs, prefersReducedMotion]);

  const visibleText = prefersReducedMotion
    ? activities[activityIndex]
    : displayText;

  return (
    <ActivityLine prefix={prefix}>
      <span>{visibleText}</span>
    </ActivityLine>
  );
}
