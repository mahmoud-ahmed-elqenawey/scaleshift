"use client";

import { LogOut, Mail, MessageCircle, RefreshCw, Link2 } from "lucide-react";
import { useCallback, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { fetchLeads, requestToken, type Lead, type Session, type SupabaseConfig } from "@/lib/leads-client";

type Props = SupabaseConfig;

const storageKey = "scaleshift-dashboard-session";
const refreshEveryMs = 60_000;
const packageLabels: Record<string, string> = { starter: "Starter · 10 videos", pro: "Pro · 10-15 videos", machine: "Machine · 25 videos" };
const budgetLabels: Record<string, string> = {
  "1000-1500": "$1,000 - $1,500", "1500-3000": "$1,500 - $3,000", "3500-5000": "$3,500 - $5,000", "5000+": "$5,000+",
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

  if (saved === undefined || (!session && saved && !error)) return null;
  if (!session) return <LoginForm {...props} error={error} onSignedIn={load} />;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold">Contact messages</h1>
          <p className="mt-1 text-sm text-white/60">
            {leads.length} {leads.length === 1 ? "message" : "messages"}
            {updatedAt ? ` · updated ${updatedAt.toLocaleTimeString()}` : ""} · {session.email}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setLoading(true); void load(session); }} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/50 disabled:opacity-50">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden /> Refresh
          </button>
          <button type="button" onClick={() => signOut()} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/50">
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      </header>
      {error && <p role="alert" className="mb-4 rounded-xl border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm">{error}</p>}
      {leads.length === 0 && !loading ? (
        <p className="rounded-2xl border border-white/10 px-6 py-16 text-center text-white/60">No messages yet. New ones from the website show up here.</p>
      ) : (
        <ul className="grid gap-4">{leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}</ul>
      )}
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
