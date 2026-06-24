import { aboutParagraphs } from "@/lib/data";

export function AboutTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium text-foreground">About</h1>
      <div className="space-y-4 text-base leading-relaxed text-muted">
        {aboutParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
