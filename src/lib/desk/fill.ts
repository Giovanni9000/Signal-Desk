import { profile } from "./profile";
import type { Job, PacketField } from "./types";

function field(
  id: string,
  label: string,
  value: string,
  source: string,
  why: string,
  force?: PacketField["status"],
): PacketField {
  const empty = value.trim().length === 0;
  const status = force ?? (empty ? "blank" : "filled");
  return { id, label, value: empty ? "" : value, source, status, why };
}

/** Pure function: profile + job in, packet out. No network. No submit. */
export function buildPacket(job: Job): PacketField[] {
  const cover = coverLetter(job);
  return [
    field("name", "Full name", profile.fullName, "CV header", "Printed on the CV."),
    field("email", "Email", profile.email, "CV header", "Use the same inbox you check daily."),
    field("phone", "Phone", profile.phone, "CV header", "South African mobile."),
    field("location", "Location", profile.location, "CV", "Do not invent a city if the form demands a suburb."),
    field("auth", "Work authorisation", profile.workAuth, "CV — Open to remote", "Safe to state. Do not guess visa categories."),
    field("github", "GitHub", profile.github, "GitHub Giovanni9000", "Public profile handle you gave me."),
    field("linkedin", "LinkedIn URL", "", "Not stored as a canonical /in/ slug", "Paste your exact profile URL. A search link is not an application answer.", "blank"),
    field("portfolio", "Portfolio URL", profile.portfolio, "Not on the CV text we have", "Leave blank until the personal site is live.", "blank"),
    field("role", "Role applied for", job.role, job.company + " listing", "Taken from the vacancy, not from a guess."),
    field("notice", "Notice period", profile.notice, "CV — available immediately", "Poultry work is current; say you can start as agreed."),
    field("education", "Education", profile.education, "CV", "Bootcamp plus UP honours. Do not rewrite the honours as a CS degree."),
    field("summary", "Professional summary", profile.summary, "CV summary, tightened", "Same facts as the CV. No new claims."),
    field("cover", "Motivation / cover note", cover, "Generated from CV facts + this job’s public requirements", "Read it once. Delete any sentence you cannot defend in an interview.", "check"),
    field("salary", "Expected salary", "", "Not on the CV", "Leave blank or write 'market related' only if the form forces a choice. Do not invent a number.", "blank"),
    field("id", "ID / passport number", "", "Not stored", "Never put an ID number into this app. Type it only on the employer’s own form.", "blank"),
    field("right", "Right to work documents", "", "Not stored", "Upload on their site yourself.", "blank"),
  ];
}

function coverLetter(job: Job): string {
  const hook = job.fitReasons[0] ?? "The role matches the work I have already shipped.";
  return [
    `I am applying for the ${job.role} role at ${job.company}.`,
    `I finished the ZAIO Full Stack & AI Bootcamp in July 2026 (Top Performer) and I have five shipped projects: a MERN Airbnb clone with JWT and deployment, plus four n8n workflows on OpenRouter (lead enrichment, a support agent with memory, email triage, and a self-healing data pipeline).`,
    hook + ".",
    `Before the bootcamp I worked in financial advice at Liberty, in cross-border agri logistics (including a remote role with Farming In Africa), and in poultry operations. I use that context when an automation has to survive a real process, not a demo.`,
    `GitHub: ${profile.github}. I am based in South Africa and available immediately for remote work.`,
    `I would like to confirm anything this note assumes about your stack before you treat it as final.`,
  ].join(" ");
}

export function matchScore(job: Job): number {
  const text = [...job.requirements, ...job.fitReasons, job.role].join(" ").toLowerCase();
  let score = 48;
  const hits: [string, number][] = [
    ["javascript", 8],
    ["typescript", 6],
    ["react", 8],
    ["node", 8],
    ["mongo", 4],
    ["n8n", 12],
    ["automation", 6],
    ["ai", 6],
    ["junior", 8],
    ["remote", 6],
    ["web", 4],
  ];
  for (const [word, points] of hits) {
    if (text.includes(word)) score += points;
  }
  if (job.gaps.length > 2) score -= 6;
  if (job.alreadyApplied) score -= 4;
  return Math.max(40, Math.min(96, score));
}