"use client";

import { useEffect, useState } from "react";
import { useHomeEffects } from "@/context/home-effects-context";
import { ActivityLine } from "./activity-line";
import { useReducedMotion } from "./use-reduced-motion";

type ActivityBurstProps = {
  prefix: string;
  activities: string[];
  holdMs?: number;
  fadeMs?: number;
};

export function ActivityBurst({
  prefix,
  activities,
  holdMs = 2600,
  fadeMs = 450,
}: ActivityBurstProps) {
  const prefersReducedMotion = useReducedMotion();
  const { triggerActivityBurst } = useHomeEffects();
  const [activityIndex, setActivityIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (activities.length <= 1) {
      return;
    }

    const interval = window.setInterval(
      () => {
        if (prefersReducedMotion) {
          setActivityIndex((current) => {
            const next = (current + 1) % activities.length;
            triggerActivityBurst();
            return next;
          });
          return;
        }

        setVisible(false);
        window.setTimeout(() => {
          setActivityIndex((current) => {
            const next = (current + 1) % activities.length;
            triggerActivityBurst();
            return next;
          });
          setVisible(true);
        }, fadeMs);
      },
      prefersReducedMotion ? 3500 : holdMs + fadeMs,
    );

    return () => window.clearInterval(interval);
  }, [
    activities.length,
    fadeMs,
    holdMs,
    prefersReducedMotion,
    triggerActivityBurst,
  ]);

  return (
    <ActivityLine prefix={prefix}>
      <span
        className={`transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {activities[activityIndex]}
      </span>
    </ActivityLine>
  );
}
