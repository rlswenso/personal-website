"use client";

import type { ActivityAnimationMode } from "@/lib/activity-animations";
import { ActivityBurst } from "./activity-burst";
import { ActivityScramble } from "./activity-scramble";
import { ActivitySlotMachine } from "./activity-slot-machine";
import { ActivityTypewriter } from "./activity-typewriter";

type ActivityRotatorProps = {
  mode: ActivityAnimationMode;
  prefix: string;
  activities: string[];
};

export function ActivityRotator({
  mode,
  prefix,
  activities,
}: ActivityRotatorProps) {
  switch (mode) {
    case "scramble":
      return <ActivityScramble prefix={prefix} activities={activities} />;
    case "slot":
      return <ActivitySlotMachine prefix={prefix} activities={activities} />;
    case "burst":
      return <ActivityBurst prefix={prefix} activities={activities} />;
    case "typewriter":
    default:
      return <ActivityTypewriter prefix={prefix} activities={activities} />;
  }
}
