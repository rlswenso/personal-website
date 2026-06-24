"use client";

import { useEffect, useState } from "react";

type CursorGlowProps = {
  className?: string;
};

export function CursorGlow({ className = "" }: CursorGlowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, var(--cursor-glow), transparent 45%)`,
      }}
    />
  );
}
