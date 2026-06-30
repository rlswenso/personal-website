"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  computeTransitionProgress,
  smoothstep,
  transitionConfig,
} from "@/lib/transition-config";

type TransitionContextValue = {
  progressRef: MutableRefObject<number>;
  progress: number;
  heroOpacity: number;
  blackOpacity: number;
  aboutPreviewOpacity: number;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

type TransitionProviderProps = {
  children: ReactNode;
};

export function TransitionProvider({ children }: TransitionProviderProps) {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const nextProgress = computeTransitionProgress();
      progressRef.current = nextProgress;
      setProgress(nextProgress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const heroOpacity = 1 - smoothstep(0, transitionConfig.heroFadeEnd, progress);
  const blackOpacity = smoothstep(
    transitionConfig.blackFadeStart,
    transitionConfig.blackFadeEnd,
    progress,
  );
  const aboutPreviewOpacity = smoothstep(
    transitionConfig.aboutPreviewStart,
    transitionConfig.aboutPreviewEnd,
    progress,
  );
  const isTransitioning = progress > 0.02 && progress < 0.995;

  const value = useMemo(
    () => ({
      progressRef,
      progress,
      heroOpacity,
      blackOpacity,
      aboutPreviewOpacity,
      isTransitioning,
    }),
    [progress, heroOpacity, blackOpacity, aboutPreviewOpacity, isTransitioning],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}
