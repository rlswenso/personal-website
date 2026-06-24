"use client";

import { useEffect, useState } from "react";
import { ActivityLine } from "./activity-line";
import { useReducedMotion } from "./use-reduced-motion";

type ActivitySlotMachineProps = {
  prefix: string;
  activities: string[];
  holdMs?: number;
};

const SPIN_DELAYS_MS = [45, 55, 70, 90, 115, 145, 185, 240, 320, 420, 560];

export function ActivitySlotMachine({
  prefix,
  activities,
  holdMs = 2800,
}: ActivitySlotMachineProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activityIndex, setActivityIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (activities.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      const interval = window.setInterval(() => {
        setActivityIndex((current) => {
          const next = (current + 1) % activities.length;
          setDisplayIndex(next);
          return next;
        });
      }, 3500);
      return () => window.clearInterval(interval);
    }

    if (activities.length <= 1) {
      return;
    }

    const timeouts: number[] = [];
    const mainTimeout = window.setTimeout(() => {
      setIsSpinning(true);
      let step = 0;

      const spinStep = () => {
        setDisplayIndex((current) => (current + 1) % activities.length);
        step += 1;

        if (step < SPIN_DELAYS_MS.length) {
          timeouts.push(window.setTimeout(spinStep, SPIN_DELAYS_MS[step]));
        } else {
          const next = (activityIndex + 1) % activities.length;
          setActivityIndex(next);
          setDisplayIndex(next);
          setIsSpinning(false);
        }
      };

      spinStep();
    }, holdMs);

    return () => {
      window.clearTimeout(mainTimeout);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [activities.length, activityIndex, holdMs, prefersReducedMotion]);

  const visibleText = activities[displayIndex] ?? "";

  return (
    <ActivityLine prefix={prefix}>
      <span
        className={`inline-block transition-all duration-150 ${
          isSpinning ? "translate-y-0.5 opacity-75" : "translate-y-0 opacity-100"
        }`}
      >
        {visibleText}
      </span>
    </ActivityLine>
  );
}
