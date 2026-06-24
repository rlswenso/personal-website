"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type BurstState = {
  strength: number;
  originX: number;
  originY: number;
  originZ: number;
};

type HomeEffectsContextValue = {
  burstRef: MutableRefObject<BurstState>;
  triggerActivityBurst: () => void;
};

const HomeEffectsContext = createContext<HomeEffectsContextValue | null>(null);

type HomeEffectsProviderProps = {
  children: ReactNode;
};

export function HomeEffectsProvider({ children }: HomeEffectsProviderProps) {
  const burstRef = useRef<BurstState>({
    strength: 0,
    originX: 0,
    originY: 0,
    originZ: 0,
  });

  const triggerActivityBurst = useCallback(() => {
    burstRef.current = {
      strength: 5.5,
      originX: 0,
      originY: 0,
      originZ: 0,
    };
  }, []);

  const value = useMemo(
    () => ({ burstRef, triggerActivityBurst }),
    [triggerActivityBurst],
  );

  return (
    <HomeEffectsContext.Provider value={value}>
      {children}
    </HomeEffectsContext.Provider>
  );
}

export function useHomeEffects() {
  const context = useContext(HomeEffectsContext);
  if (!context) {
    throw new Error("useHomeEffects must be used within HomeEffectsProvider");
  }
  return context;
}
