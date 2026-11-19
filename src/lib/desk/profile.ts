/** Facts we are allowed to put on a form. If it is not here, the field stays blank. */
export const profile = {
  fullName: "Giovanni Boni",
  email: "giovanniboni34@gmail.com",
  phone: "+27 78 573 0143",
  location: "South Africa",
  workAuth: "South African citizen / based in South Africa. Open to remote.",
  github: "https://github.com/Giovanni9000",
  githubHandle: "Giovanni9000",
  linkedin: "https://www.linkedin.com/search/results/all/?keywords=Giovanni%20Boni%20ZAIO",
  portfolio: "",
  headline: "Fullstack developer (MERN) and AI automation engineer",
  summary:
    "ZAIO Full Stack & AI Bootcamp graduate (Jan–Jul 2026, Top Performer). Five shipped projects: a full-stack Airbnb clone (React, Node, Express, MongoDB, JWT, Netlify + Render) and four n8n + OpenRouter workflows (lead enrichment, support agent, email triage, self-healing data pipeline). Earlier work in financial advice (Liberty), logistics (Farming In Africa, remote from Ghana, and Enza Zaden), and agribusiness (BSc Agric Hons, University of Pretoria).",
  stack: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "n8n", "Python"],
  projects: [
    "Airbnb clone — MERN, JWT, Figma-to-code, deployed",
    "AI Lead Enrichment — n8n + LLM scoring",
    "Trackly support agent — memory + knowledge base",
    "Email triage agent",
    "Self-healing data pipeline",
  ],
  education: "ZAIO Full Stack & AI Bootcamp, completed Jul 2026. BSc Agriculture (Hons), Agribusiness, University of Pretoria, 2019–2023.",
  notice: "Available immediately",
  salary: "",
  idNumber: "",
  visa: "",
} as const;

export type Profile = typeof profile;