import type { ReactNode } from "react";

type ActivityLineProps = {
  prefix: string;
  children: ReactNode;
  className?: string;
};

export function ActivityLine({
  prefix,
  children,
  className = "",
}: ActivityLineProps) {
  return (
    <p
      className={`max-w-xl text-base leading-relaxed text-muted sm:text-lg ${className}`}
    >
      <span>{prefix}</span>
      <span className="inline-block min-h-[1.5em]">{children}</span>
    </p>
  );
}
