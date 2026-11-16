"use client";

import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { freshSession, type Session, type SupabaseConfig } from "@/lib/leads-client";
import { heroVideoUrl, moveId, uploadGuidelines, validateUpload, type HeroVideo, type VideoSection } from "@/lib/hero-videos";

type Props = SupabaseConfig & { section: VideoSection; session: Session; onSession: (session: Session) => void; onExpired: () => void };

const api = "/api/hero-videos";
const buttonClass = "inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs hover:border-white/50 disabled:opacity-40";

export function HeroVideosPanel({ section, session, onSession, onExpired, ...config }: Props) {
  const [videos, setVideos] = useState<HeroVideo[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  // Every write goes through the Worker with the dashboard's Supabase token; it refreshes the token first when needed.
  const call = useCallback(async (init: RequestInit & { query?: string }) => {
    const current = await freshSession(config, session);
    if (current !== session) onSession(current);
    const response = await fetch(`${api}${init.query ?? ""}`, { ...init, headers: { Authorization: `Bearer ${current.access_token}` } });
    if (response.status === 401) { onExpired(); throw new Error("Your session expired. Please sign in again."); }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    return data;
  }, [config, session, onSession, onExpired]);

  const reload = useCallback(() => {
    fetch(`${api}?section=${section}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Could not load videos."))))
      .then((list: HeroVideo[]) => { setVideos(list); setError(""); })
      .catch((failure: unknown) => setError(failure instanceof Error ? failure.message : "Could not load videos."));
  }, [section]);

  useEffect(reload, [reload]);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError("");
    try { await action(); reload(); } catch (failure) { setError(failure instanceof Error ? failure.message : "Something went wrong."); }
    setBusy(false);
  };

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("section", section);
    const file = data.get("file");
    const problem = validateUpload(file instanceof File ? file : null, data.get("title"));
    if (problem) { setError(problem); return; }
    await run(async () => { await call({ method: "POST", body: data }); form.reset(); });
  }

  const reorder = (id: string, direction: -1 | 1) => {
    if (!videos) return;
    const ids = moveId(videos.map((video) => video.id), id, direction);
    void run(() => call({ method: "PATCH", body: JSON.stringify({ ids }) }));
  };

  const remove = (id: string) => {
    setConfirming(null);
    void run(() => call({ method: "DELETE", query: `?id=${id}` }));
  };

  return (
    <div>
      <form onSubmit={upload} className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="grid gap-1.5 text-sm font-medium">Title
          <input name="title" required maxLength={80} placeholder={section === "hero" ? "Portfolio reel 011" : "Selected work 7"} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-normal outline-none focus:border-brand-red" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">Video (MP4, up to 15 MB)
          <input name="file" type="file" accept="video/mp4,.mp4" required className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-white" />
        </label>
        <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 font-semibold disabled:opacity-60">
          <Upload className="size-4" aria-hidden /> {busy ? "Working…" : "Upload"}
        </button>
        <p className="text-xs text-white/55 sm:col-span-3">Export settings: {uploadGuidelines}</p>
      </form>
      {error && <p role="alert" className="mb-4 rounded-xl border border-brand-red/50 bg-brand-red/10 px-4 py-3 text-sm">{error}</p>}
      {videos === null ? (
        <p className="text-white/60">Loading…</p>
      ) : videos.length === 0 ? (
        <p className="rounded-2xl border border-white/10 px-6 py-16 text-center text-white/60">No videos yet. The site shows its built-in videos until you upload some.</p>
      ) : (
        <ol className="grid gap-3">
          {videos.map((video, index) => (
            <li key={video.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <video src={heroVideoUrl(video.key)} controls preload="metadata" muted playsInline className="h-32 w-[4.5rem] shrink-0 rounded-lg bg-black object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold"><span className="mr-2 text-white/40">{index + 1}.</span>{video.title}</p>
                <p className="mt-1 break-all text-xs text-white/50" dir="ltr">{video.key}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => reorder(video.id, -1)} disabled={busy || index === 0} className={buttonClass} aria-label="Move up"><ArrowUp className="size-3.5" aria-hidden /></button>
                <button type="button" onClick={() => reorder(video.id, 1)} disabled={busy || index === videos.length - 1} className={buttonClass} aria-label="Move down"><ArrowDown className="size-3.5" aria-hidden /></button>
                {confirming === video.id ? (
                  <>
                    <button type="button" onClick={() => remove(video.id)} disabled={busy} className={`${buttonClass} border-brand-red bg-brand-red`}>Yes, delete</button>
                    <button type="button" onClick={() => setConfirming(null)} className={buttonClass}>Cancel</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirming(video.id)} disabled={busy} className={`${buttonClass} text-brand-red`}><Trash2 className="size-3.5" aria-hidden /> Delete</button>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
