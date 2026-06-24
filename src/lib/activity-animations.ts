export const activityAnimationModes = [
  { id: "typewriter", label: "Typewriter" },
  { id: "scramble", label: "Scramble decode" },
  { id: "slot", label: "Slot machine" },
  { id: "burst", label: "Particle burst" },
] as const;

export type ActivityAnimationMode = (typeof activityAnimationModes)[number]["id"];

export const defaultActivityAnimationMode: ActivityAnimationMode = "scramble";

export const SCRAMBLE_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%&";
