"use client";

import { tocSections } from "@/lib/sections";
import { useScroll } from "@/context/scroll-context";
import { ThemeToggle } from "./theme-toggle";
import { CursorNavLink } from "./cursor-nav-link";

export function Header() {
  const { activeSection, heroOpacity, scrollToSection } = useScroll();

  // Nav fades together with the "Hey, I'm Ryder" greeting.
  const navOpacity = heroOpacity;
  const navHidden = navOpacity <= 0.04;

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-30"
      style={{ opacity: navOpacity }}
      aria-hidden={navHidden}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-10">
        <nav
          className={`flex flex-wrap gap-1.5 ${navHidden ? "" : "pointer-events-auto"}`}
          aria-label="Sections"
        >
          {tocSections.map((section) => (
            <CursorNavLink
              key={section.id}
              label={section.label}
              isActive={activeSection === section.id}
              onClick={() => scrollToSection(section.id)}
            />
          ))}
        </nav>
        <div className={navHidden ? "" : "pointer-events-auto"}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
