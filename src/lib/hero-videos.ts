export type HeroVideo = { id: string; created_at: string; title: string; key: string; sort_order: number };
export type HeroReel = { label: string; src: string };

export const r2PublicBase = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev";
export const maxUploadBytes = 15 * 1024 * 1024;
export const maxTitleLength = 80;
export const uploadPrefix = "hero/";
// Same account the RLS policies in supabase/migrations name; the API refuses every other signed-in user.
export const dashboardOwnerEmail = "attwa.editor@gmail.com";
export const uploadGuidelines =
  "MP4 (H.264 + AAC), 1080×1920, 30 fps, 2.5–4 Mbps. A 30s reel should be 5–8 MB and never above 15 MB.";

export const heroVideoUrl = (key: string) => `${r2PublicBase}/${key.split("/").map(encodeURIComponent).join("/")}`;

export const toReel = (video: HeroVideo): HeroReel => ({ label: video.title, src: heroVideoUrl(video.key) });

export const byOrder = (videos: HeroVideo[]) =>
  [...videos].sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));

export const fallbackHeroReels: HeroReel[] = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(3, "0");
  return { label: `Portfolio reel ${number}`, src: `${r2PublicBase}/portfolio/${index === 9 ? "0010" : number}.mp4` };
});

export function validateUpload(file: { type: string; size: number; name: string } | null, title: unknown): string | null {
  const cleanTitle = typeof title === "string" ? title.trim() : "";
  if (!cleanTitle || cleanTitle.length > maxTitleLength) return `Title is required (up to ${maxTitleLength} characters).`;
  if (!file || file.size === 0) return "Choose a video file.";
  if (file.type !== "video/mp4" && !/\.mp4$/i.test(file.name)) return "Only MP4 (H.264) videos are accepted.";
  if (file.size > maxUploadBytes) {
    return `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB; the limit is 15 MB. Export it smaller: ${uploadGuidelines}`;
  }
  return null;
}

// Moves one id a step up or down and returns the new id order; unknown ids and out-of-range moves return the input.
export function moveId(ids: string[], id: string, direction: -1 | 1): string[] {
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return ids;
  const next = [...ids];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

// MP4/MOV files start with a size-prefixed "ftyp" box; anything else is not a video the browsers will play.
export const looksLikeMp4 = (bytes: Uint8Array) =>
  bytes.length > 12 && String.fromCharCode(...bytes.subarray(4, 8)) === "ftyp";
