import { siteConfig, socialLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 text-[11px] uppercase tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Social links">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-foreground/80 underline-offset-4 transition hover:text-foreground hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted/70">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
