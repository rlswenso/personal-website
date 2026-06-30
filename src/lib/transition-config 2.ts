export const transitionConfig = {
  scrollHeightVh: 200,
  scrollHeightVhReduced: 130,
  cameraZStart: 10,
  cameraZEnd: 2.1,
  cameraYEnd: 0.15,
  fovStart: 55,
  fovEnd: 42,
  portalSpreadStrength: 9.5,
  portalVoidRadius: 2.8,
  particleFadeStart: 0.5,
  particleFadeEnd: 0.92,
  heroFadeEnd: 0.38,
  blackFadeStart: 0.42,
  blackFadeEnd: 0.88,
  aboutPreviewStart: 0.72,
  aboutPreviewEnd: 0.94,
};

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

  const scrolled = clamp(-zone.getBoundingClientRect().top, 0, scrollable);
  return scrolled / scrollable;
}
