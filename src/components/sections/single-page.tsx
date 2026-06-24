"use client";

import { homeIntro, siteConfig, socialLinks } from "@/lib/data";
import { PointerProvider } from "@/context/pointer-context";
import { HomeEffectsProvider } from "@/context/home-effects-context";
import { TransitionProvider, useTransition } from "@/context/transition-context";
import { useScroll } from "@/context/scroll-context";
import { ParticleField } from "@/components/three/particle-field-loader";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { ActivityScramble } from "@/components/home/activity-scramble";
import { useReducedMotion } from "@/components/home/use-reduced-motion";
import { transitionConfig } from "@/lib/transition-config";
import { CursorMagneticLink } from "@/components/layout/cursor-magnetic-link";
import { AboutTab } from "@/components/tabs/about-tab";
import { ProjectsTab } from "@/components/tabs/projects-tab";
import { ExperienceTab } from "@/components/tabs/experience-tab";

const sectionClassName =
  "mx-auto max-w-3xl scroll-mt-8 px-6 py-12 sm:py-16";

function HeroScrollZone() {
  const { transitionProgress } = useScroll();
  const { heroOpacity, backgroundOpacity } = useTransition();
  const prefersReducedMotion = useReducedMotion();
  const scrollHeightVh = prefersReducedMotion
    ? transitionConfig.scrollHeightVhReduced
    : transitionConfig.scrollHeightVh;
  const showCursorGlow = transitionProgress < 0.2;

  return (
    <div id="home" className="relative">
      <div
        id="hero-scroll-zone"
        className="relative"
        style={{ height: `${scrollHeightVh}vh` }}
      >
        <div className="sticky top-0 h-dvh overflow-hidden">
          <ParticleField className="absolute inset-0 z-0 h-full w-full" />
          {showCursorGlow ? <CursorGlow /> : null}

          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/25 via-transparent to-background/35"
            style={{ opacity: Math.max(0, 1 - transitionProgress * 1.6) }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-[15] bg-background"
            style={{ opacity: backgroundOpacity }}
          />

          <div
            className="relative z-10 flex h-full flex-col px-6 pb-10 pt-16 sm:px-10 sm:pb-14 sm:pt-18"
            style={{
              opacity: heroOpacity,
              transform: `translateY(${transitionProgress * -24}px)`,
            }}
          >
            <div className="mx-auto flex w-full max-w-5xl flex-1 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {homeIntro.greeting}
                </h1>
                <ActivityScramble
                  prefix={homeIntro.activityPrefix}
                  activities={homeIntro.activities}
                />
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 text-[11px] uppercase tracking-[0.18em] sm:flex-row sm:items-end sm:justify-between">
              <nav aria-label="Social links">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <CursorMagneticLink
                        href={link.href}
                        external={link.href.startsWith("http")}
                      >
                        {link.label}
                      </CursorMagneticLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex flex-col gap-1 text-right text-muted sm:items-end">
                <span className="text-foreground/80">{siteConfig.location}</span>
                <span className="text-foreground/80">{siteConfig.school}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          id="hero-end"
          className="pointer-events-none absolute bottom-0 h-px w-full"
          aria-hidden
        />
      </div>
    </div>
  );
}

export function SinglePage() {
  return (
    <>
      <PointerProvider>
        <HomeEffectsProvider>
          <TransitionProvider>
            <HeroScrollZone />
          </TransitionProvider>
        </HomeEffectsProvider>
      </PointerProvider>

      <div className="relative z-10 bg-background">
        <section id="about" className={sectionClassName}>
          <AboutTab />
        </section>

        <section id="projects" className={sectionClassName}>
          <ProjectsTab />
        </section>

        <section id="experience" className={sectionClassName}>
          <ExperienceTab />
        </section>
      </div>
    </>
  );
}
