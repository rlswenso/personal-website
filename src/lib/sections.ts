export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const tocSections = sections.filter((section) => section.id !== "home");
