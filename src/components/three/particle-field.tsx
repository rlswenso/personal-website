"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTransition } from "@/context/transition-context";
import { particleColors } from "@/lib/three-config";
import { Particles } from "./particle-field-scene";
import { TransitionCamera } from "./transition-camera";

type ParticleFieldCanvasProps = {
  className?: string;
};

export function ParticleFieldCanvas({ className = "" }: ParticleFieldCanvasProps) {
  const { resolvedTheme } = useTheme();
  const { progressRef, physicsProgressRef } = useTransition();
  const [animate, setAnimate] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimate(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!mounted) {
    return <div className={`bg-background ${className}`} aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";
  const particleColor = isDark ? particleColors.dark : particleColors.light;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <TransitionCamera progressRef={physicsProgressRef} />
        <Particles
          color={particleColor}
          animate={animate}
          progressRef={progressRef}
          physicsProgressRef={physicsProgressRef}
        />
      </Canvas>
    </div>
  );
}
