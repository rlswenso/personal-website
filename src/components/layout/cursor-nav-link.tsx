"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/home/use-reduced-motion";

type TabOffset = {
  x: number;
  y: number;
  glow: number;
};

type CursorNavLinkProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "header" | "toc";
};

export function CursorNavLink({
  label,
  isActive,
  onClick,
  variant = "header",
}: CursorNavLinkProps) {
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef<TabOffset>({ x: 0, y: 0, glow: 0 });
  const [offset, setOffset] = useState<TabOffset>({ x: 0, y: 0, glow: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const button = buttonRef.current;
    if (!button) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / 100);

      offsetRef.current = {
        x: dx * influence * 0.18,
        y: dy * influence * 0.18,
        glow: influence,
      };
    };

    const onLeave = () => {
      offsetRef.current = { x: 0, y: 0, glow: 0 };
    };

    const animate = () => {
      const target = offsetRef.current;
      setOffset((current) => ({
        x: current.x + (target.x - current.x) * 0.2,
        y: current.y + (target.y - current.y) * 0.2,
        glow: current.glow + (target.glow - current.glow) * 0.2,
      }));
      frameRef.current = requestAnimationFrame(animate);
    };

    button.addEventListener("mousemove", onMove);
    button.addEventListener("mouseleave", onLeave);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      button.removeEventListener("mousemove", onMove);
      button.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  const glowOpacity = prefersReducedMotion ? 0 : offset.glow * 0.85;
  const translateX = prefersReducedMotion ? 0 : offset.x;
  const translateY = prefersReducedMotion ? 0 : offset.y;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        boxShadow:
          glowOpacity > 0.08
            ? `0 0 ${12 + glowOpacity * 20}px color-mix(in srgb, var(--cursor-glow-core) ${Math.round(glowOpacity * 100)}%, transparent)`
            : undefined,
      }}
      className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${
        variant === "header"
          ? isActive
            ? "bg-foreground text-background"
            : "text-muted hover:text-foreground"
          : isActive
            ? "text-foreground"
            : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
