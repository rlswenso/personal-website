"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  computeHeroOpacity,
  computeTransitionProgress,
  isAboutSectionVisible,
} from "@/lib/transition-config";
import { tocSections, type SectionId } from "@/lib/sections";

type ScrollContextValue = {
  activeSection: SectionId;
  transitionProgress: number;
  heroOpacity: number;
  showSideToc: boolean;
  progressRef: MutableRefObject<number>;
  scrollToSection: (id: SectionId) => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

function computeActiveSection(aboutVisible: boolean): SectionId {
  if (!aboutVisible) {
    return "home";
  }

  const marker = window.innerHeight * 0.3;
  let active: SectionId = "about";

  for (const section of tocSections) {
    const element = document.getElementById(section.id);
    if (!element) {
      continue;
    }

    if (element.getBoundingClientRect().top <= marker) {
      active = section.id;
    }
  }

  return active;
}

type ScrollProviderProps = {
  children: ReactNode;
};

export function ScrollProvider({ children }: ScrollProviderProps) {
  const progressRef = useRef(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [showSideToc, setShowSideToc] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  const scrollToSection = useCallback((id: SectionId) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    let running = true;

    const tick = () => {
      if (!running) {
        return;
      }

      const progress = computeTransitionProgress();
      const nextHeroOpacity = computeHeroOpacity(progress);
      const nextShowSideToc = isAboutSectionVisible();
      const nextActive = computeActiveSection(nextShowSideToc);

      progressRef.current = progress;

      setTransitionProgress((current) =>
        Math.abs(current - progress) > 0.001 ? progress : current,
      );
      setHeroOpacity((current) =>
        Math.abs(current - nextHeroOpacity) > 0.001 ? nextHeroOpacity : current,
      );
      setShowSideToc((current) =>
        current === nextShowSideToc ? current : nextShowSideToc,
      );
      setActiveSection((current) =>
        current === nextActive ? current : nextActive,
      );

      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const progress = computeTransitionProgress();
      progressRef.current = progress;
      setTransitionProgress(progress);
      setHeroOpacity(computeHeroOpacity(progress));
      setShowSideToc(isAboutSectionVisible());
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const value = useMemo(
    () => ({
      activeSection,
      transitionProgress,
      heroOpacity,
      showSideToc,
      progressRef,
      scrollToSection,
    }),
    [
      activeSection,
      transitionProgress,
      heroOpacity,
      showSideToc,
      scrollToSection,
    ],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }
  return context;
}
