"use client";

import dynamic from "next/dynamic";

const ParticleFieldCanvas = dynamic(
  () =>
    import("./particle-field").then((module) => module.ParticleFieldCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-background" aria-hidden />
    ),
  },
);

type ParticleFieldProps = {
  className?: string;
};

export function ParticleField({ className }: ParticleFieldProps) {
  return (
    <ParticleFieldCanvas className={className ?? "absolute inset-0 h-full w-full"} />
  );
}
