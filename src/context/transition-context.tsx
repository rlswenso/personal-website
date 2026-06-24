"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { useScroll } from "@/context/scroll-context";
import { smoothstep, transitionConfig } from "@/lib/transition-config";

type TransitionContextValue = {
  progressRef: MutableRefObject<number>;
  physicsProgressRef: MutableRefObject<number>;
  progress: number;
  heroOpacity: number;
  backgroundOpacity: number;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

type TransitionProviderProps = {
  children: ReactNode;
};

export function TransitionProvider({ children }: TransitionProviderProps) {
  const { progressRef, transitionProgress, heroOpacity } = useScroll();
  const physicsProgressRef = useRef(0);

  useEffect(() => {
    let physicsFrame = 0;
    let running = true;

    const updatePhysicsProgress = () => {
      if (!running) {
        return;
      }

      const target = progressRef.current;
      const current = physicsProgressRef.current;
      let rate = target > current ? 0.14 : 0.055;

      if (target < current && target < 0.55) {
        rate = 0.09;
      }

      if (target < 0.04) {
        rate = 0.12;
      }

      physicsProgressRef.current += (target - current) * rate;
      physicsFrame = requestAnimationFrame(updatePhysicsProgress);
    };

    physicsFrame = requestAnimationFrame(updatePhysicsProgress);

    return () => {
      running = false;
      cancelAnimationFrame(physicsFrame);
    };
  }, [progressRef]);

  const backgroundOpacity = smoothstep(
    transitionConfig.backgroundFadeStart,
    transitionConfig.backgroundFadeEnd,
    transitionProgress,
  );

  const value = useMemo(
    () => ({
      progressRef,
      physicsProgressRef,
      progress: transitionProgress,
      heroOpacity,
      backgroundOpacity,
    }),
    [progressRef, transitionProgress, heroOpacity, backgroundOpacity],
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
