/**
 * Hero text + top nav fade together over this progress range (0–1).
 * Higher `heroFadeEnd` → greeting/activity/nav stay visible longer.
 */
export const heroFadeEnd = 0.2;

/**
 * How much scroll progress builds before the hero zone pins (first pixels of scroll).
 * Higher → hero/nav start reacting sooner on initial scroll.
 */
export const heroPrePinProgressWeight = 0.45;

export const transitionConfig = {
  scrollHeightVh: 115,
  scrollHeightVhReduced: 115,
  cameraZStart: 10,
  cameraZEnd: 2.1,
  cameraYEnd: 0.15,
  fovStart: 55,
  fovEnd: 42,
  portalSpreadStrength: 9.5,
  portalVoidRadius: 2.8,
  particleFadeStart: 0.75,
  particleFadeEnd: 1,
  heroFadeEnd,
  blackFadeStart: 0.42,
  blackFadeEnd: 0.88,
  aboutPreviewStart: 0.72,
  aboutPreviewEnd: 0.94,
  backgroundFadeStart: 0.4,
  backgroundFadeEnd: 0.92,
  scrollBackInfluxStrength: 6.2,
  scrollBackSwirlStrength: 3.2,
  scrollBackTurbulenceBoost: 2.4,
  heroPrePinProgressWeight,
};

/** Nav hides when hero opacity drops below this (synced with hero text). */
export const navHideOpacityThreshold = 0.04;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function computeTransitionProgress(zoneId = "hero-scroll-zone") {
  const zone = document.getElementById(zoneId);
  if (!zone) {
    return 0;
  }

  const scrollable = zone.offsetHeight - window.innerHeight;
  if (scrollable <= 0) {
    return 0;
  }

  const rect = zone.getBoundingClientRect();
  const pinProgress = clamp(-rect.top, 0, scrollable) / scrollable;

  // Ramp progress during initial scroll before the sticky zone pins.
  const prePinDistance = Math.max(zone.offsetTop, 1);
  const prePinProgress =
    clamp(window.scrollY / prePinDistance, 0, 1) *
    transitionConfig.heroPrePinProgressWeight;

  return Math.max(prePinProgress, pinProgress);
}

export function computeHeroOpacity(
  progress = computeTransitionProgress(),
) {
  return 1 - smoothstep(0, transitionConfig.heroFadeEnd, progress);
}

export function shouldHideTopNav(
  progress = computeTransitionProgress(),
) {
  return computeHeroOpacity(progress) <= navHideOpacityThreshold;
}

export function isAboutSectionVisible() {
  const about = document.getElementById("about");
  if (!about) {
    return false;
  }

  // Side TOC is visible from the moment About scrolls into view through the
  // rest of the page (Projects, Experience, Writing, footer). It only hides
  // while the user is still inside the hero zoom zone.
  return about.getBoundingClientRect().top <= window.innerHeight;
}
