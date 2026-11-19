export type FieldStatus = "filled" | "blank" | "check";

export type PacketField = {
  id: string;
  label: string;
  value: string;
  source: string;
  status: FieldStatus;
  why: string;
};

export type JobTier = "zaio" | "close" | "stretch";

export type Job = {
  id: string;
  company: string;
  role: string;
  location: string;
  mode: string;
  url: string;
  sourceNote: string;
  alreadyApplied: boolean;
  tier: JobTier;
  fitReasons: string[];
  gaps: string[];
  requirements: string[];
  recruiterInbox?: string;
  linkedinCompanySearch: string;
};

export type Referral = {
  who: string;
  channel: "email" | "linkedin-search";
  detail: string;
  href: string;
  draft: string;
  honesty: string;
};