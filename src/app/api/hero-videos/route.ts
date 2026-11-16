import { getCloudflareContext } from "@opennextjs/cloudflare";
import { r2Store, type ObjectStore } from "../../../lib/r2-store.ts";
import { byOrder, dashboardOwnerEmail, isDashboardUpload, looksLikeMp4, maxUploadBytes, parseSection, uploadPrefix, validateUpload, type HeroVideo, type VideoSection } from "../../../lib/hero-videos.ts"; // relative with extension so node --test can import it

type Deps = { bucket: () => ObjectStore | undefined; env: () => { url?: string; key?: string } };

const table = (url: string) => `${url}/rest/v1/hero_videos`;
const unavailable = () => Response.json({ error: "Hero videos are not configured" }, { status: 503 });
const unauthorized = () => Response.json({ error: "Sign in again" }, { status: 401 });

export function createHandlers({ bucket, env }: Deps) {
  const config = () => {
    const { url, key } = env();
    return url && key ? { url, key } : null;
  };

  const headers = (apiKey: string, token: string, extra: Record<string, string> = {}) => ({
    apikey: apiKey, Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...extra,
  });

  // The dashboard sends its Supabase session token; it must be valid AND belong to the owner account.
  const ownerToken = async (request: Request, cfg: { url: string; key: string }) => {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!token) return null;
    const response = await fetch(`${cfg.url}/auth/v1/user`, { headers: headers(cfg.key, token) }).catch(() => null);
    const user = response?.ok ? ((await response.json().catch(() => null)) as { email?: string } | null) : null;
    return user?.email === dashboardOwnerEmail ? token : null;
  };

  const list = async (cfg: { url: string; key: string }, section: VideoSection): Promise<HeroVideo[] | null> => {
    const response = await fetch(`${table(cfg.url)}?select=*&section=eq.${section}&order=sort_order.asc,created_at.asc`, {
      headers: headers(cfg.key, cfg.key),
    }).catch(() => null);
    if (!response?.ok) {
      console.error("hero-videos: list failed", response?.status);
      return null;
    }
    return byOrder(await response.json());
  };

  async function GET(request: Request) {
    const cfg = config();
    if (!cfg) return unavailable();
    const section = parseSection(new URL(request.url).searchParams.get("section"));
    if (!section) return Response.json({ error: "Unknown section" }, { status: 400 });
    const videos = await list(cfg, section);
    if (!videos) return Response.json({ error: "Could not load videos" }, { status: 502 });
    return Response.json(videos, { headers: { "Cache-Control": "public, max-age=60" } });
  }

  async function POST(request: Request) {
    const cfg = config();
    const store = bucket();
    if (!cfg || !store) return unavailable();
    const token = await ownerToken(request, cfg);
    if (!token) return unauthorized();
    // Refuse oversized bodies before buffering them; the 64 KB slack covers the multipart envelope.
    if (Number(request.headers.get("content-length")) > maxUploadBytes + 64 * 1024) {
      return Response.json({ error: "The file is above the 15 MB limit." }, { status: 413 });
    }

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    const title = form?.get("title");
    const section = parseSection(form?.get("section"));
    const problem = validateUpload(file instanceof File ? file : null, title);
    if (problem || !(file instanceof File) || !section) return Response.json({ error: problem ?? "Invalid upload" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    if (!looksLikeMp4(new Uint8Array(bytes))) return Response.json({ error: "This file is not an MP4 video." }, { status: 400 });

    const existing = await list(cfg, section);
    if (!existing) return Response.json({ error: "Could not load videos" }, { status: 502 });
    const key = `${uploadPrefix(section)}${crypto.randomUUID()}.mp4`;
    try {
      await store.put(key, bytes, "video/mp4");
    } catch (error) {
      console.error("hero-videos: R2 put failed", error);
      return Response.json({ error: "Could not store the video" }, { status: 502 });
    }

    const sort_order = (existing.at(-1)?.sort_order ?? 0) + 1;
    const inserted = await fetch(table(cfg.url), {
      method: "POST",
      headers: headers(cfg.key, token, { Prefer: "return=representation" }),
      body: JSON.stringify({ title: String(title).trim(), key, sort_order, section }),
    }).catch(() => null);
    if (!inserted?.ok) {
      console.error("hero-videos: insert failed", inserted?.status, await inserted?.text());
      await store.delete(key).catch(() => undefined);
      return Response.json({ error: "Could not save the video" }, { status: inserted?.status === 401 ? 401 : 502 });
    }
    const [video] = (await inserted.json()) as HeroVideo[];
    return Response.json(video, { status: 201 });
  }

  async function DELETE(request: Request) {
    const cfg = config();
    const store = bucket();
    if (!cfg || !store) return unavailable();
    const token = await ownerToken(request, cfg);
    if (!token) return unauthorized();
    const id = new URL(request.url).searchParams.get("id") ?? "";
    if (!/^[0-9a-f-]{36}$/i.test(id)) return Response.json({ error: "Invalid id" }, { status: 400 });

    const removed = await fetch(`${table(cfg.url)}?id=eq.${id}`, {
      method: "DELETE",
      headers: headers(cfg.key, token, { Prefer: "return=representation" }),
    }).catch(() => null);
    if (!removed?.ok) {
      console.error("hero-videos: delete failed", removed?.status);
      return Response.json({ error: "Could not delete the video" }, { status: 502 });
    }
    const [video] = (await removed.json()) as HeroVideo[];
    if (!video) return Response.json({ error: "Video not found" }, { status: 404 });
    // Seeded rows point at shared portfolio/ files or Cloudinary URLs, so only dashboard uploads leave R2.
    if (isDashboardUpload(video.key)) await store.delete(video.key).catch((error: unknown) => console.error("hero-videos: R2 delete failed", error));
    return Response.json({ ok: true });
  }

  async function PATCH(request: Request) {
    const cfg = config();
    if (!cfg) return unavailable();
    const token = await ownerToken(request, cfg);
    if (!token) return unauthorized();
    const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
    const ids = Array.isArray(body?.ids) ? body.ids : null;
    if (!ids || ids.length > 100 || !ids.every((id) => typeof id === "string" && /^[0-9a-f-]{36}$/i.test(id))) {
      return Response.json({ error: "Invalid order" }, { status: 400 });
    }
    const results = await Promise.all(ids.map((id, index) =>
      fetch(`${table(cfg.url)}?id=eq.${id}`, {
        method: "PATCH",
        headers: headers(cfg.key, token, { Prefer: "return=minimal" }),
        body: JSON.stringify({ sort_order: index + 1 }),
      }).catch(() => null),
    ));
    if (results.some((response) => !response?.ok)) {
      console.error("hero-videos: reorder failed", results.map((response) => response?.status));
      return Response.json({ error: "Could not save the order" }, { status: 502 });
    }
    return Response.json({ ok: true });
  }

  return { GET, POST, DELETE, PATCH };
}

const devVars = (): Record<string, string | undefined> => {
  try { return getCloudflareContext().env as Record<string, string | undefined>; } catch { return {}; }
};

export const { GET, POST, DELETE, PATCH } = createHandlers({
  // Deployed Workers copy secrets into process.env; `next dev` only exposes .dev.vars through the Cloudflare context.
  bucket: () => r2Store(process.env) ?? r2Store(devVars()),
  env: () => ({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_PUBLISHABLE_KEY }),
});
