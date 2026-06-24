import Link from "next/link";
import { Fragment } from "react";
import { projects, projectsNote } from "@/lib/data";

export function ProjectsTab() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium text-foreground">Projects</h1>
      <ul className="space-y-6">
        {projects.map((project) => {
          const links =
            project.links ??
            (project.href && project.linkLabel
              ? [{ label: project.linkLabel, href: project.href }]
              : []);

          return (
            <li
              key={project.title}
              className="space-y-2 border-b border-border pb-6 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg text-foreground">{project.title}</h2>
                <span className="shrink-0 text-sm text-muted">
                  {project.year}
                </span>
              </div>
              {project.description ? (
                <p className="text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              ) : null}
              {links.length > 0 ? (
                <p className="text-sm text-muted">
                  {links.map((link, index) => {
                    const isLast = index === links.length - 1;
                    const separator = isLast ? null : ", ";

                    if (!link.href) {
                      return (
                        <Fragment key={`${link.label}-${index}`}>
                          {link.label}
                          {separator}
                        </Fragment>
                      );
                    }

                    const external = link.href.startsWith("http");
                    return (
                      <Fragment key={`${link.label}-${index}`}>
                        <Link
                          href={link.href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
                        >
                          {link.label}
                        </Link>
                        {separator}
                      </Fragment>
                    );
                  })}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {projectsNote ? (
        <p className="text-sm italic text-muted">{projectsNote}</p>
      ) : null}
    </div>
  );
}
