"use client";

import {
  activityAnimationModes,
  type ActivityAnimationMode,
} from "@/lib/activity-animations";

type ActivityAnimationPickerProps = {
  selected: ActivityAnimationMode;
  onSelect: (mode: ActivityAnimationMode) => void;
};

export function ActivityAnimationPicker({
  selected,
  onSelect,
}: ActivityAnimationPickerProps) {
  return (
    <div className="mt-10 rounded-lg border border-border/80 bg-background/70 p-4 backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        Activity animation drafts
      </p>
      <p className="mt-1 text-sm text-muted">
        Compare styles, then pick one to keep.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {activityAnimationModes.map((mode) => {
          const isActive = selected === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelect(mode.id)}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
