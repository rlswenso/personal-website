export type ProjectLink = {
  label: string;
  href?: string;
};

export type Project = {
  title: string;
  description?: string;
  tags?: string[];
  /** @deprecated Use `links` for mixed text + linked labels. */
  href?: string;
  /** @deprecated Use `links` for mixed text + linked labels. */
  linkLabel?: string;
  links?: ProjectLink[];
  year: string;
};

export type Writing = {
  title: string;
  description?: string;
  href?: string;
  date: string;
  type: "essay" | "note" | "talk";
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  description?: string;
  tags?: string[];
};

export type Education = {
  school: string;
  degree: string;
  period: string;
  details?: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "twitter" | "email" | "substack";
};
