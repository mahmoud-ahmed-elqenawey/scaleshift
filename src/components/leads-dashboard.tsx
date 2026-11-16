"use client";

import { ArrowUpRight, Clapperboard, Film, LogOut, Mail, MessageCircle, RefreshCw, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroVideosPanel } from "@/components/hero-videos-panel";
import { useCallback, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { fetchLeads, requestToken, type Lead, type Session, type SupabaseConfig } from "@/lib/leads-client";

type Props = SupabaseConfig;
type Tab = "leads" | "hero" | "work";
const tabs: { id: Tab; label: string; hint: string; icon: typeof Mail }[] = [
  { id: "leads", label: "Messages", hint: "Sent from the contact form", icon: Mail },
  { id: "hero", label: "Header videos", hint: "The reels orbiting in the home-page hero", icon: Clapperboard },
  { id: "work", label: "Selected Work", hint: "The strip of reels under the hero", icon: Film },
];
const titles: Record<Tab, string> = { leads: "Messages", hero: "Header videos", work: "Selected Work" };

const storageKey = "scaleshift-dashboard-session";
const refreshEveryMs = 60_000;
const packageLabels: Record<string, string> = { starter: "Starter · 10 videos", pro: "Pro · 10-15 videos", machine: "Machine · 25 videos", custom: "Custom" };
const budgetLabels: Record<string, string> = {
  "1000-1500": "$1,000 - $1,500", "1500-3000": "$1,500 - $3,000", "3500-5000": "$3,500 - $5,000", "5000+": "+Custom",
};

const readSession = (): Session | null => {
  try { return JSON.parse(localStorage.getItem(storageKey) ?? "null"); } catch { return null; }
};
// Snapshot of the stored session (its refresh token) so a signed-in visitor never sees the login form flash.
const savedToken = () => readSession()?.refresh_token ?? null;
const ignoreChanges = () => () => {};
const saveSession = (session: Session | null) => {
  try { if (session) localStorage.setItem(storageKey, JSON.stringify(session)); else localStorage.removeItem(storageKey); } catch {}
};

export function LeadsDashboard(props: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const saved = useSyncExternalStore(ignoreChanges, savedToken, () => undefined);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>("leads");
  const [counts, setCounts] = useState<Partial<Record<Tab, number>>>({});

  const signOut = useCallback((message = "") => {
    saveSession(null);
    setSession(null);
    setLeads([]);
    setError(message);
  }, []);

  const apply = useCallback((result: { session: Session; leads: Lead[] }) => {
    saveSession(result.session);
    setSession(result.session);
    setLeads(result.leads);
    setUpdatedAt(new Date());
    setError("");
    setLoading(false);
  }, []);

  const fail = useCallback((failure: unknown) => {
    setLoading(false);
    signOut(failure instanceof Error ? failure.message : "Something went wrong.");
  }, [signOut]);

  const load = useCallback((current: Session) => fetchLeads(props, current).then(apply, fail), [props, apply, fail]);

  useEffect(() => {
    const stored = readSession();
    if (stored) void load(stored);
  }, [load]);

  useEffect(() => {
    if (!session) return;
    const timer = setInterval(() => { if (document.visibilityState === "visible") void load(session); }, refreshEveryMs);
    return () => clearInterval(timer);
  }, [session, load]);

  // Live counts for the sidebar; re-read whenever the user moves between sections (after edits).
  useEffect(() => {
    if (!session) return;
    for (const section of ["hero", "work"] as const) {
      fetch(`/api/hero-videos?section=${section}`, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((list: unknown) => { if (Array.isArray(list)) setCounts((current) => ({ ...current, [section]: list.length })); })
        .catch(() => undefined);
    }
  }, [session, tab]);

  if (saved === undefined || (!session && saved && !error)) return null;
  if (!session) return <div className="px-4"><LoginForm {...props} error={error} onSignedIn={load} /></div>;

  const current = tabs.find((item) => item.id === tab) ?? tabs[0];
  const allCounts = { ...counts, leads: leads.length };
  const onSession = (next: Session) => { saveSession(next); setSession(next); };
  const onExpired = () => signOut("Your session expired. Please sign in again.");

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-6 border-b border-white/10 bg-black px-4 py-5 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-5 md:py-7">
        <Link href="/" className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
          <Image src="/brand/scaleshift-mark.svg" alt="" width={34} height={34} className="size-[34px] rounded-lg bg-white p-1" />
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">ScaleShift</span>
            <span className="block text-xs text-white/50">Dashboard</span>
          </span>
        </Link>
        <nav aria-label="Sections" className="-mx-1 flex gap-1 overflow-x-auto md:mx-0 md:flex-col md:overflow-visible">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-red md:w-full ${
                  active ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1 text-left">{label}</span>
                <span className={`min-w-[1.5rem] rounded-md px-1.5 py-0.5 text-center text-xs tabular-nums ${active ? "bg-brand-red text-white" : "bg-white/[0.06] text-white/60"}`}>
                  {allCounts[id] ?? "–"}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="hidden flex-1 md:block" />
        <div className="hidden gap-2 md:grid">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white">
            <ArrowUpRight className="size-4" aria-hidden /> Open the website
          </Link>
          <div className="mt-2 border-t border-white/10 pt-4">
            <p className="truncate px-3 text-xs text-white/45" title={session.email}>{session.email}</p>
            <button type="button" onClick={() => signOut()} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/[0.04] hover:text-white">
              <LogOut className="size-4" aria-hidden /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-8 md:py-9">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{titles[tab]}</h1>
            <p className="mt-1.5 text-sm text-white/55">
              {tab === "leads" && updatedAt ? `${current.hint} · updated ${updatedAt.toLocaleTimeString()}` : current.hint}
            </p>
          </div>
          <div className="flex gap-2">
            {tab === "leads" && (
              <button type="button" onClick={() => { setLoading(true); void load(session); }} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40 disabled:opacity-50">
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden /> Refresh
              </button>
            )}
            <button type="button" onClick={() => signOut()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-white/40 md:hidden">
              <LogOut className="size-4" aria-hidden /> Sign out
            </button>
          </div>
        </header>
        {tab !== "leads" && (
          <HeroVideosPanel key={tab} {...props} section={tab} session={session} onSession={onSession} onExpired={onExpired} />
        )}
        {tab === "leads" && error && <p role="alert" className="mb-4 rounded-xl border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm">{error}</p>}
        {tab === "leads" && (leads.length === 0 && !loading ? (
          <p className="rounded-2xl border border-white/10 px-6 py-16 text-center text-white/60">No messages yet. New ones from the website show up here.</p>
        ) : (
          <ul className="grid max-w-4xl gap-4">{leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}</ul>
        ))}
      </main>
    </div>
  );
}

function LoginForm({ error, onSignedIn, ...props }: Props & { error: string; onSignedIn: (session: Session) => Promise<unknown> }) {
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      setMessage("");
      await onSignedIn(await requestToken(props, "password", { email: form.get("email"), password: form.get("password") }));
    } catch (failure) {
      setMessage(failure instanceof Error ? failure.message : "Sign-in failed");
    }
    setStatus("idle");
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-[12vh] grid w-full max-w-sm gap-4 rounded-2xl border border-brand-red/50 bg-black p-7">
      <h1 className="text-2xl font-bold">ScaleShift <span className="text-brand-red">leads</span></h1>
      <p className="-mt-2 text-sm text-white/60">Sign in to see messages from the contact form.</p>
      <label className="grid gap-1.5 text-sm font-medium">Email
        <input name="email" type="email" required autoComplete="username" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-normal outline-none focus:border-brand-red" />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">Password
        <input name="password" type="password" required autoComplete="current-password" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-normal outline-none focus:border-brand-red" />
      </label>
      {(message || error) && <p role="alert" className="text-sm text-brand-red">{message || error}</p>}
      <button type="submit" disabled={status === "sending"} className="rounded-xl bg-brand-red px-4 py-3 font-semibold disabled:opacity-60">
        {status === "sending" ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const brandHref = /^https?:\/\//i.test(lead.brand_link) ? lead.brand_link : `https://${lead.brand_link}`;
  const linkClass = "inline-flex items-center gap-1.5 text-white/80 hover:text-white";

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">{lead.full_name}</h2>
        <time dateTime={lead.created_at} className="text-sm text-white/50">{new Date(lead.created_at).toLocaleString()}</time>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-brand-red px-3 py-1 font-medium">{packageLabels[lead.package] ?? lead.package}</span>
        <span className="rounded-full border border-white/20 px-3 py-1">{budgetLabels[lead.budget] ?? lead.budget}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a href={`mailto:${lead.email}`} className={linkClass}><Mail className="size-4" aria-hidden />{lead.email}</a>
        <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className={linkClass} dir="ltr">
          <MessageCircle className="size-4" aria-hidden />{lead.phone}
        </a>
        <a href={brandHref} target="_blank" rel="noreferrer" className={`${linkClass} break-all`}><Link2 className="size-4 shrink-0" aria-hidden />{lead.brand_link}</a>
      </div>
      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/85">{lead.message}</p>
    </li>
  );
}
