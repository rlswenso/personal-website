"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/components/home/use-reduced-motion";

type Offset = {
  x: number;
  y: number;
  glow: number;
};

type CursorMagneticLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
};

export function CursorMagneticLink({
  href,
  children,
  external,
  className = "",
}: CursorMagneticLinkProps) {
  const prefersReducedMotion = useReducedMotion();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const offsetRef = useRef<Offset>({ x: 0, y: 0, glow: 0 });
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0, glow: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      const rect = anchor.getBoundingClientRect();
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

    anchor.addEventListener("mousemove", onMove);
    anchor.addEventListener("mouseleave", onLeave);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      anchor.removeEventListener("mousemove", onMove);
      anchor.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  const glowOpacity = prefersReducedMotion ? 0 : offset.glow * 0.85;
  const translateX = prefersReducedMotion ? 0 : offset.x;
  const translateY = prefersReducedMotion ? 0 : offset.y;

  return (
    <a
      ref={anchorRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        textShadow:
          glowOpacity > 0.08
            ? `0 0 ${10 + glowOpacity * 14}px color-mix(in srgb, var(--cursor-glow-core) ${Math.round(glowOpacity * 100)}%, transparent)`
            : undefined,
      }}
      className={`inline-block text-muted no-underline transition-colors duration-150 hover:text-foreground ${className}`}
    >
      {children}
    </a>
  );
}
