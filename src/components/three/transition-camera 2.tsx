"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, type MutableRefObject } from "react";
import type { PerspectiveCamera } from "three";
import {
  lerp,
  smoothstep,
  transitionConfig,
} from "@/lib/transition-config";

type TransitionCameraProps = {
  progressRef: MutableRefObject<number>;
};

export function TransitionCamera({ progressRef }: TransitionCameraProps) {
  const zoomPhase = useRef(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useFrame(({ camera }) => {
    if (reducedMotionRef.current) {
      return;
    }

    const progress = progressRef.current;
    const targetPhase = smoothstep(0.08, 0.82, progress);
    zoomPhase.current += (targetPhase - zoomPhase.current) * 0.12;

    const phase = zoomPhase.current;
    const perspectiveCamera = camera as PerspectiveCamera;

    perspectiveCamera.position.z = lerp(
      transitionConfig.cameraZStart,
      transitionConfig.cameraZEnd,
      phase,
    );
    perspectiveCamera.position.y = lerp(0, transitionConfig.cameraYEnd, phase);
    perspectiveCamera.position.x = 0;
    perspectiveCamera.fov = lerp(
      transitionConfig.fovStart,
      transitionConfig.fovEnd,
      phase,
    );
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}
