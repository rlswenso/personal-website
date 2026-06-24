"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import type { Group, Points, PointsMaterial } from "three";
import { Matrix4, Vector3 } from "three";
import { usePointer } from "@/context/pointer-context";
import { useHomeEffects } from "@/context/home-effects-context";
import {
  createParticlePositions,
  createParticleVelocities,
  getBoxHalf,
  particleFieldConfig,
  particlePhysicsConfig,
} from "@/lib/three-config";
import { clamp, smoothstep, transitionConfig } from "@/lib/transition-config";

type ParticlesProps = {
  color: string;
  animate: boolean;
  progressRef: MutableRefObject<number>;
  physicsProgressRef: MutableRefObject<number>;
};

function applyWallBounce(
  position: number,
  velocity: number,
  bound: number,
  bounce: number,
  jitter: number,
) {
  if (position > bound) {
    return {
      position: bound,
      velocity:
        -Math.abs(velocity) * bounce + (Math.random() - 0.5) * jitter,
    };
  }

  if (position < -bound) {
    return {
      position: -bound,
      velocity: Math.abs(velocity) * bounce + (Math.random() - 0.5) * jitter,
    };
  }

  return { position, velocity };
}

export function Particles({
  color,
  animate,
  progressRef,
  physicsProgressRef,
}: ParticlesProps) {
  const boxRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const baseOpacityRef = useRef(0.62);
  const lastTransitionProgressRef = useRef(0);
  const { pointerRef } = usePointer();
  const { burstRef } = useHomeEffects();
  const { camera } = useThree();
  const { count, spread, size, spawnSphereRatio } = particleFieldConfig;
  const {
    repulsion,
    influence,
    damping,
    bounce,
    bounceJitter,
    maxSpeed,
    drift,
    turbulence,
    wallInset,
    cornerRepulsion,
    rotationFromPointer,
    rotationFromVelocity,
    rotationLerp,
    burstRadius,
    burstDecay,
  } = particlePhysicsConfig;
  const boxHalf = getBoxHalf(spread);
  const wallBound = boxHalf - wallInset;
  const cornerThreshold = boxHalf * 0.72;

  const inverseBoxMatrix = useMemo(() => new Matrix4(), []);
  const ndc = useMemo(() => new Vector3(), []);
  const worldRayDirection = useMemo(() => new Vector3(), []);
  const localRayOrigin = useMemo(() => new Vector3(), []);
  const localRayDirection = useMemo(() => new Vector3(), []);
  const closestPoint = useMemo(() => new Vector3(), []);
  const toParticle = useMemo(() => new Vector3(), []);

  const positions = useMemo(
    () => createParticlePositions(count, spread, spawnSphereRatio),
    [count, spread, spawnSphereRatio],
  );

  // Snapshot of the initial spawn positions so we can deterministically
  // restore the original layout when the user scrolls back up.
  const initialPositions = useMemo(() => positions.slice(), [positions]);

  const velocities = useMemo(
    () => createParticleVelocities(count, drift),
    [count, drift],
  );

  useFrame((_, delta) => {
    const box = boxRef.current;
    const points = pointsRef.current;
    const positionAttribute = points?.geometry.attributes.position;

    if (!box || !points || !positionAttribute) {
      return;
    }

    const transitionProgress = progressRef.current;
    const physicsProgress = physicsProgressRef.current;
    const scrollDelta = transitionProgress - lastTransitionProgressRef.current;
    const scrollingUp = scrollDelta < -0.0004;
    lastTransitionProgressRef.current = transitionProgress;

    if (!animate && physicsProgress < 0.001 && transitionProgress < 0.001) {
      return;
    }

    const portalPhase = smoothstep(0.12, 0.78, physicsProgress);
    // 0 = fully at home (original spawn), 1 = fully scrolled into portal.
    // Used to blend particles back to their initial positions on scroll-up.
    const homecomingPhase = 1 - smoothstep(0, 0.35, physicsProgress);
    const pointerScale = 1 - smoothstep(0.08, 0.45, physicsProgress);
    const rotationScale = 1 - smoothstep(0.1, 0.55, physicsProgress);
    const cornerRepulsionScale = 1 - portalPhase * 0.9;
    const spawnRadius = boxHalf * spawnSphereRatio;
    const pointer = pointerRef.current;
    // Suppress lingering scroll-direction state we no longer use.
    void scrollingUp;
    const deltaScale = Math.min(delta * 60, 2);
    const influenceSq = influence * influence;

    const targetRotationY =
      (pointer.x * rotationFromPointer + pointer.vx * rotationFromVelocity) *
      rotationScale;
    const targetRotationX =
      (pointer.y * rotationFromPointer - pointer.vy * rotationFromVelocity) *
      rotationScale;

    box.rotation.y += (targetRotationY - box.rotation.y) * rotationLerp;
    box.rotation.x += (targetRotationX - box.rotation.x) * rotationLerp;
    box.updateMatrixWorld();

    inverseBoxMatrix.copy(box.matrixWorld).invert();

    ndc.set(pointer.x, pointer.y, 0.5);
    ndc.unproject(camera);
    worldRayDirection.copy(ndc).sub(camera.position).normalize();

    localRayOrigin.copy(camera.position).applyMatrix4(inverseBoxMatrix);
    localRayDirection
      .copy(worldRayDirection)
      .transformDirection(inverseBoxMatrix)
      .normalize();

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;

      let px = positionAttribute.array[offset];
      let py = positionAttribute.array[offset + 1];
      let pz = positionAttribute.array[offset + 2];

      let velocityX = velocities[offset];
      let velocityY = velocities[offset + 1];
      let velocityZ = velocities[offset + 2];

      const burst = burstRef.current;
      if (burst.strength > 0.05) {
        const burstX = px - burst.originX;
        const burstY = py - burst.originY;
        const burstZ = pz - burst.originZ;
        const burstDistanceSq = burstX * burstX + burstY * burstY + burstZ * burstZ;
        const burstRadiusSq = burstRadius * burstRadius;

        if (burstDistanceSq < burstRadiusSq && burstDistanceSq > 0.0001) {
          const burstDistance = Math.sqrt(burstDistanceSq);
          const burstForce =
            (1 - burstDistance / burstRadius) * burst.strength * deltaScale;
          velocityX += (burstX / burstDistance) * burstForce;
          velocityY += (burstY / burstDistance) * burstForce;
          velocityZ += (burstZ / burstDistance) * burstForce;
        }
      }

      if (portalPhase > 0.001) {
        const dist = Math.hypot(px, py, pz);
        if (dist > 0.08) {
          const voidFactor =
            Math.exp(-dist / transitionConfig.portalVoidRadius) * portalPhase;
          const force =
            transitionConfig.portalSpreadStrength * voidFactor * deltaScale;
          velocityX += (px / dist) * force;
          velocityY += (py / dist) * force;
          velocityZ += (pz / dist) * force;
        }
      }

      // Homecoming: as the user scrolls back toward the hero, deterministically
      // blend each particle's position toward its original spawn position.
      // This guarantees the field always looks identical to first load when
      // back at the top, regardless of how chaotic the portal got.
      if (homecomingPhase > 0.001) {
        const homeX = initialPositions[offset];
        const homeY = initialPositions[offset + 1];
        const homeZ = initialPositions[offset + 2];

        const dx = homeX - px;
        const dy = homeY - py;
        const dz = homeZ - pz;
        const distFromHome = Math.hypot(dx, dy, dz);

        // Only pull the particle back / bleed velocity while it's still far
        // from its spawn position. Particles already near home are left alone
        // so they keep their natural ambient drift.
        const reclaim = clamp(distFromHome / (spawnRadius * 0.4), 0, 1);
        if (reclaim > 0.01) {
          const blend = homecomingPhase * 0.18 * reclaim;
          px += dx * blend;
          py += dy * blend;
          pz += dz * blend;

          const velocityBleed = 1 - homecomingPhase * 0.18 * reclaim;
          velocityX *= velocityBleed;
          velocityY *= velocityBleed;
          velocityZ *= velocityBleed;
        }
      }

      if (pointer.active && pointerScale > 0.05) {
        toParticle.set(px, py, pz).sub(localRayOrigin);
        const projection = toParticle.dot(localRayDirection);
        closestPoint
          .copy(localRayDirection)
          .multiplyScalar(Math.max(0, projection))
          .add(localRayOrigin);

        const deltaX = px - closestPoint.x;
        const deltaY = py - closestPoint.y;
        const deltaZ = pz - closestPoint.z;
        const distanceSq = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;

        if (distanceSq < influenceSq && distanceSq > 0.0001) {
          const distance = Math.sqrt(distanceSq);
          const push =
            (1 - distance / influence) * repulsion * deltaScale * pointerScale;
          velocityX += (deltaX / distance) * push;
          velocityY += (deltaY / distance) * push;
          velocityZ += (deltaZ / distance) * push;
        }
      }

      const nearCornerX = Math.abs(px) > cornerThreshold;
      const nearCornerY = Math.abs(py) > cornerThreshold;
      const nearCornerZ = Math.abs(pz) > cornerThreshold;
      const cornerAxes =
        Number(nearCornerX) + Number(nearCornerY) + Number(nearCornerZ);

      if (cornerAxes >= 2) {
        velocityX +=
          -Math.sign(px || 1) * cornerRepulsion * delta * cornerRepulsionScale;
        velocityY +=
          -Math.sign(py || 1) * cornerRepulsion * delta * cornerRepulsionScale;
        velocityZ +=
          -Math.sign(pz || 1) * cornerRepulsion * delta * cornerRepulsionScale;
      }

      velocityX += (Math.random() - 0.5) * turbulence * delta;
      velocityY += (Math.random() - 0.5) * turbulence * delta;
      velocityZ += (Math.random() - 0.5) * turbulence * delta;

      velocityX *= damping;
      velocityY *= damping;
      velocityZ *= damping;

      const speed = Math.hypot(velocityX, velocityY, velocityZ);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        velocityX *= scale;
        velocityY *= scale;
        velocityZ *= scale;
      }

      px += velocityX * delta;
      py += velocityY * delta;
      pz += velocityZ * delta;

      const xBounce = applyWallBounce(
        px,
        velocityX,
        wallBound,
        bounce,
        bounceJitter,
      );
      px = xBounce.position;
      velocityX = xBounce.velocity;

      const yBounce = applyWallBounce(
        py,
        velocityY,
        wallBound,
        bounce,
        bounceJitter,
      );
      py = yBounce.position;
      velocityY = yBounce.velocity;

      const zBounce = applyWallBounce(
        pz,
        velocityZ,
        wallBound,
        bounce,
        bounceJitter,
      );
      pz = zBounce.position;
      velocityZ = zBounce.velocity;

      positionAttribute.array[offset] = px;
      positionAttribute.array[offset + 1] = py;
      positionAttribute.array[offset + 2] = pz;
      velocities[offset] = velocityX;
      velocities[offset + 1] = velocityY;
      velocities[offset + 2] = velocityZ;
    }

    burstRef.current.strength *= burstDecay;

    const material = points.material as PointsMaterial | undefined;
    if (material) {
      const fade = smoothstep(
        transitionConfig.particleFadeStart,
        transitionConfig.particleFadeEnd,
        physicsProgress,
      );
      material.opacity = baseOpacityRef.current * (1 - fade * 0.92);
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <group ref={boxRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={size}
          transparent
          opacity={0.62}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
