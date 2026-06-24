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

export type PointerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  clientX: number;
  clientY: number;
  active: boolean;
};

type PointerContextValue = {
  pointerRef: MutableRefObject<PointerState>;
};

const PointerContext = createContext<PointerContextValue | null>(null);

type PointerProviderProps = {
  children: ReactNode;
};

export function PointerProvider({ children }: PointerProviderProps) {
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    clientX: 0,
    clientY: 0,
    active: false,
  });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      pointerRef.current = {
        x,
        y,
        vx: x - lastX,
        vy: y - lastY,
        clientX: event.clientX,
        clientY: event.clientY,
        active: true,
      };

      lastX = x;
      lastY = y;
    };

    const onLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.vx = 0;
      pointerRef.current.vy = 0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const value = useMemo(() => ({ pointerRef }), []);

  return (
    <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
  );
}

export function usePointer() {
  const context = useContext(PointerContext);
  if (!context) {
    throw new Error("usePointer must be used within PointerProvider");
  }
  return context;
}
