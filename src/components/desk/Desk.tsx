import { useEffect, useMemo, useState } from "react";
import { Bell, Copy, ExternalLink } from "lucide-react";
import { jobs } from "../../lib/desk/jobs";
import { buildPacket, matchScore } from "../../lib/desk/fill";
import { referralsFor } from "../../lib/desk/outreach";
import { pingVacancy } from "../../lib/desk/notify";
import type { PacketField } from "../../lib/desk/types";
type Tab = "packet" | "people";
type Due = { jobId: string; at: number };

const WAIT = [
  { label: "Open now", minutes: 0 },
  { label: "In 5 min", minutes: 5 },
  { label: "In 15 min", minutes: 15 },
] as const;

export function Desk() {
  const [jobId, setJobId] = useState(jobs[0].id);
  const [tab, setTab] = useState<Tab>("packet");
  const [due, setDue] = useState<Due | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [banner, setBanner] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
  const base = useMemo(() => buildPacket(job), [job]);
  const fields: PacketField[] = base.map((f) =>
    edits[job.id + ":" + f.id] !== undefined
      ? { ...f, value: edits[job.id + ":" + f.id], status: edits[job.id + ":" + f.id].trim() ? "check" : "blank" }
      : f,
  );
  const score = matchScore(job);
  const referrals = referralsFor(job);
  const blanks = fields.filter((f) => f.status === "blank");

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!due || now < due.at) return;
    const target = jobs.find((j) => j.id === due.jobId);
    if (!target) return;
    setBanner(target.company);
    void pingVacancy(
      `Open ${target.company} now`,
      `${target.role}. Packet is ready — you still submit on their site.`,
      target.url,
    );
    window.open(target.url, "_blank", "noopener,noreferrer");
    setDue(null);
  }, [now, due]);

  function arm(minutes: number) {
    if (minutes === 0) {
      setDue({ jobId: job.id, at: Date.now() });
      return;
    }
    setDue({ jobId: job.id, at: Date.now() + minutes * 60_000 });
    setBanner(null);
  }

  async function copyPacket() {
    const text = fields.map((f) => `${f.label}: ${f.value || "[leave blank]"}`).join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const remaining = due && due.jobId === job.id ? Math.max(0, due.at - now) : 0;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent">Signal Desk</p>
            <h1 className="font-display text-3xl font-medium leading-tight">Review the packet. You press submit.</h1>
            <p className="mt-1 max-w-xl text-muted">
              Giovanni Boni · open roles for this CV · checked 26 Nov 2026 · nothing is sent from this app.
            </p>
          </div>
          <button type="button" onClick={() => arm(0)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink">
            <ExternalLink size={18} aria-hidden />
            Open this vacancy
          </button>
        </div>
      </header>

      {banner && (
        <div className="bg-ink text-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="font-medium">Time to apply at {banner}. A tab should have opened. If a blocker stopped it, use the button.</p>
            <a className="underline" href={jobs.find((j) => j.company === banner)?.url} target="_blank" rel="noreferrer">
              Open vacancy again
            </a>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-2">
          {jobs.map((item) => (
            <button key={item.id} type="button" onClick={() => { setJobId(item.id); setTab("packet"); }} className={`rounded-xl border px-3 py-3 text-left ${item.id === job.id ? "border-accent bg-ok-bg" : "border-line bg-surface"}`}>
              <span className="block text-sm text-muted">{item.company}</span>
              <span className="block font-semibold leading-snug">{item.role}</span>
              <span className="mt-1 block text-sm text-muted">{matchScore(item)} match · {item.tier}{item.alreadyApplied ? " · already applied" : ""}</span>
            </button>
          ))}
        </aside>

        <main className="flex flex-col gap-4">
          <section className="rounded-xl border border-line bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl">{job.role}</h2>
                <p className="text-muted">{job.company} · {job.location} · {job.mode}</p>
              </div>
              <p className="rounded-full bg-ok-bg px-3 py-1 text-sm font-semibold text-accent">{score} / 100 fit</p>
            </div>
            <p className="mt-3 text-sm text-muted">{job.sourceNote}</p>
            {job.alreadyApplied && (
              <p className="mt-3 rounded-lg bg-warn-bg px-3 py-2 text-sm text-warn">This link is a success page. Do not submit again. Use it only to check what you already sent.</p>
            )}
            <ul className="mt-3 list-disc pl-5 text-sm">
              {job.fitReasons.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <ul className="mt-2 list-disc pl-5 text-sm text-warn">
              {job.gaps.map((g) => <li key={g}>{g}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {WAIT.map((w) => (
                <button key={w.label} type="button" onClick={() => arm(w.minutes)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 py-2 text-sm font-semibold">
                  <Bell size={16} aria-hidden />
                  {w.label}
                </button>
              ))}
              {remaining > 0 && (
                <span className="self-center text-sm text-muted">Opens in {Math.ceil(remaining / 1000)}s — stay on this tab.</span>
              )}
            </div>
          </section>

          <nav className="flex flex-wrap gap-2">
            {(["packet", "people"] as Tab[]).map((id) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold ${tab === id ? "bg-ink text-surface" : "bg-surface border border-line"}`}>
                {id === "packet" ? "Application" : "Who to ask"}
              </button>
            ))}
          </nav>

          {tab === "packet" && (
            <section className="rounded-xl border border-line bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
                <p className="text-sm text-muted">{blanks.length} fields left blank on purpose. Edit anything that is wrong before you copy it across.</p>
                <button type="button" onClick={() => void copyPacket()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm font-semibold">
                  <Copy size={16} aria-hidden />
                  {copied ? "Copied" : "Copy packet"}
                </button>
              </div>
              <ul>
                {fields.map((f) => (
                  <li key={f.id} className="grid gap-2 border-b border-line px-4 py-3 md:grid-cols-[180px_1fr]">
                    <div>
                      <p className="font-semibold">{f.label}</p>
                      <p className={`text-xs font-semibold ${f.status === "blank" ? "text-warn" : "text-accent"}`}>
                        {f.status === "blank" ? "Leave blank" : f.status === "check" ? "Read before sending" : "Filled"}
                      </p>
                    </div>
                    <div>
                      <textarea
                        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm"
                        rows={f.value.length > 140 ? 5 : 2}
                        value={f.value}
                        placeholder="Leave this empty on their form"
                        onChange={(e) => setEdits((prev) => ({ ...prev, [job.id + ":" + f.id]: e.target.value }))}
                      />
                      <p className="mt-1 text-xs text-muted">{f.source}. {f.why}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "people" && (
            <section className="flex flex-col gap-3">
              <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
                LinkedIn does not allow a public scrape, and Google usually only shows the login wall. Names pulled that way are often wrong. This list is limited to inboxes printed on the advert, plus a search you run while you are logged in.
              </p>
              {referrals.map((r) => (
                <article key={r.who} className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold">{r.who}</h3>
                  <p className="text-sm text-muted">{r.detail}</p>
                  <p className="mt-2 text-sm">{r.honesty}</p>
                  <a className="mt-3 inline-flex min-h-11 items-center font-semibold text-accent" href={r.href} target="_blank" rel="noreferrer">
                    {r.channel === "email" ? "Open email draft" : "Open LinkedIn search"}
                  </a>
                  <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-bg p-3 text-sm">{r.draft}</pre>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}