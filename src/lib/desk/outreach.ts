import type { Job, Referral } from "./types";
import { profile } from "./profile";

export function referralsFor(job: Job): Referral[] {
  const items: Referral[] = [];
  if (job.recruiterInbox) {
    items.push({
      who: `${job.company} recruitment inbox`,
      channel: "email",
      detail: job.recruiterInbox,
      href: `mailto:${job.recruiterInbox}?subject=${encodeURIComponent(job.role + " — Giovanni Boni")}`,
      honesty: "This address was published on the job advert. It is a shared inbox, not a personal referral.",
      draft: emailDraft(job, job.recruiterInbox),
    });
  }
  items.push({
    who: `People at ${job.company} (you still choose who)`,
    channel: "linkedin-search",
    detail: "LinkedIn people search — engineering, talent, or founder",
    href: job.linkedinCompanySearch,
    honesty:
      "This app does not scrape LinkedIn and does not invent employee names or private emails. Open the search, pick a real person, and only message someone whose profile you have actually read.",
    draft: linkedinNote(job),
  });
  items.push({
    who: "ZAIO placement instructor",
    channel: "email",
    detail: "Warm intro inside the network that already sourced these links",
    href: "mailto:?subject=" + encodeURIComponent(`Intro request — ${job.company}`),
    honesty: "You already have this relationship. A referral from the person who found the vacancy beats a cold note.",
    draft: `Hi — I’m preparing an application for ${job.role} at ${job.company}. I’ve drafted the packet in my review tool and I have not submitted it. If you know someone on that team, would you be willing to pass my GitHub (${profile.github}) along, or tell me who owns hiring? I’ll keep the note short.`,
  });
  return items;
}

function emailDraft(job: Job, inbox: string): string {
  return [
    `To: ${inbox}`,
    `Subject: ${job.role} — Giovanni Boni (ZAIO, MERN + n8n)`,
    ``,
    `Hello,`,
    ``,
    `I am applying for the ${job.role} role. I am a South Africa-based ZAIO Full Stack & AI graduate (July 2026) with a deployed MERN Airbnb clone and four n8n automation projects.`,
    `GitHub: ${profile.github}`,
    `Email: ${profile.email} · Phone: ${profile.phone}`,
    ``,
    `If a short call is useful I am available immediately.`,
    ``,
    `Giovanni Boni`,
  ].join("\n");
}

function linkedinNote(job: Job): string {
  return `Hi — I saw the ${job.role} opening at ${job.company}. I’m a ZAIO grad (MERN + n8n) based in South Africa, GitHub ${profile.githubHandle}. I’m not asking you to refer a stranger; if you are close to the hire, I’d value 10 minutes on what the team actually needs. If not, no worries.`;
}