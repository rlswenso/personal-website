import type {
  Education,
  Experience,
  Project,
  SocialLink,
} from "./types";

export const siteConfig = {
  name: "Ryder Swenson",
  title: "Ryder Swenson",
  description:
    "Builder at the intersection of technology, startups, AI, and venture.",
  email: "hello@ryderswenson.com",
  location: "San Francisco, CA",
  school: "Brown University",
  tagline: "Building at the edge of technology, startups, and venture.",
};

export const homeIntro = {
  greeting: "Hey, I'm Ryder!",
  activityPrefix: "Right now I am ",
  activities: [
    "watching the World Cup",
    "skateboarding",
    "reading about tech",
    "producing music",
    "building computers",
    "taking photos",
    "learning Korean",
  ],
};

export const aboutParagraphs = [
  "I have always been excited by complex problems. Mixed with a love for technology that developed when I started building computers in middle school, this curiosity led me to Brown where I study Applied Mathematics and Computer Science.",
  "In any futuristic world, world builders imbue the first tangible differences from our own world with technology. I am motivated by the opportunity to shape this future in tech, today, and I can’t wait to discover what’s next.",
];

export const experiences: Experience[] = [
  {
    role: "Data Operations",
    company: "Panels",
    period: "2026 - Present",
  },
  {
    role: "Executive Board",
    company: "Brown Product Management",
    period: "2025 — Present",
  },
  {
    role: "Executive Board",
    company: "FinTech at Brown",
    period: "2025 — Present",
  },
  {
    role: "Fall M&A Analyst",
    company: "Hill View Partners",
    period: "2025",
  },
  {
    role: "Summer Intern",
    company: "GOAT Group",
    period: "2023 — 2025",
    description: "FP&A, Trade and Customs, Tax, and Accounting",
  },
];

export const projects: Project[] = [
  {
    title: "Multi-Agent RL",
    year: "May 2026",
    links: [
      { label: "Academic" },
      { label: "Paper", href: "/multi-agent-rl.pdf" },
    ],
  },
  {
    title: "Psychedelic San Francisco",
    year: "May 2026",
    links: [
      { label: "Photography" },
      { label: "Web", href: "https://ryderfinalproject.netlify.app/" },
    ],
  },
];

export const projectsNote = "More coming soon";

export const education: Education[] = [
  {
    school: "Your University",
    degree: "Degree, Major",
    period: "2020 — 2024",
    details: "Relevant coursework, honors, or activities.",
  },
];

export const socialLinks: SocialLink[] = [
  {
    label: "Email",
    href: "mailto:ryder_swenson@brown.edu",
    icon: "email",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ryder-lee-swenson",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/rlswenso",
    icon: "github",
  },
  {
    label: "X",
    href: "https://x.com/ryder_swenson",
    icon: "twitter",
  },
  {
    label: "Substack",
    href: "https://substack.com/@ryderswenson",
    icon: "substack",
  },
];
