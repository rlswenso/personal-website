"use client";

import { useEffect, useRef } from "react";
import { usePointer } from "@/context/pointer-context";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { pointerRef } = usePointer();

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const glow = glowRef.current;
      const pointer = pointerRef.current;

      if (glow) {
        glow.style.left = `${pointer.clientX}px`;
        glow.style.top = `${pointer.clientY}px`;

        const velocity = Math.min(
          Math.hypot(
            pointer.vx * window.innerWidth,
            pointer.vy * window.innerHeight,
          ) / 18,
          1,
        );

        glow.style.opacity = pointer.active ? `${0.22 + velocity * 0.1}` : "0";
        glow.style.transform = `translate(-50%, -50%) scale(${1 + velocity * 0.12})`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [pointerRef]);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed z-[2] h-80 w-80 rounded-full opacity-0 will-change-[left,top,transform,opacity]"
      style={{
        left: 0,
        top: 0,
        background:
          "radial-gradient(circle, var(--cursor-glow-core) 0%, var(--cursor-glow-mid) 24%, transparent 78%)",
        filter: "blur(3px)",
      }}
    />
  );
}
