"use client";

import { tocSections } from "@/lib/sections";
import { useScroll } from "@/context/scroll-context";
import { CursorNavLink } from "./cursor-nav-link";

export function SideToc() {
  const { activeSection, showSideToc, scrollToSection } = useScroll();

  if (!showSideToc) {
    return null;
  }

  return (
    <aside
      className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 duration-500 lg:flex"
      aria-label="Table of contents"
    >
      <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
        Contents
      </p>
      {tocSections.map((section) => (
        <CursorNavLink
          key={section.id}
          label={section.label}
          isActive={activeSection === section.id}
          onClick={() => scrollToSection(section.id)}
          variant="toc"
        />
      ))}
    </aside>
  );
}
