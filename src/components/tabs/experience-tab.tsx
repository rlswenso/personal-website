import { experiences } from "@/lib/data";

export function ExperienceTab() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium text-foreground">Experience</h1>
      <ul className="space-y-6">
        {experiences.map((item) => (
          <li
            key={`${item.company}-${item.role}`}
            className="space-y-1 border-b border-border pb-6 last:border-0"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h2 className="text-lg text-foreground">{item.company}</h2>
                <p className="text-sm text-muted">{item.role}</p>
              </div>
              <p className="text-sm text-muted">{item.period}</p>
            </div>
            {item.description ? (
              <p className="pt-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
