export const packages = ["starter", "pro", "machine", "custom"] as const;
export const budgets = ["1000-1500", "1500-3000", "3500-5000", "5000+"] as const;

const maxLength = { full_name: 120, email: 254, phone: 16, brand_link: 300, package: 20, budget: 20, message: 5000 } as const;
type Lead = Record<keyof typeof maxLength, string>;

const text = (value: unknown, max: number) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length <= max ? trimmed : "";
};

export function parseLead(body: unknown): Lead | null {
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const lead = Object.fromEntries(
    Object.entries(maxLength).map(([key, max]) => [key, text(input[key], max)]),
  ) as Lead;
  const valid =
    Object.values(lead).every(Boolean) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) &&
    /^\+\d{6,15}$/.test(lead.phone) &&
    (packages as readonly string[]).includes(lead.package) &&
    (budgets as readonly string[]).includes(lead.budget);
  return valid ? lead : null;
}

// shortcut: in-memory per instance, so counts reset on cold starts; move to a shared store if spam shows up
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  if (hits.size > 5000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((at) => Date.now() - at < 60_000);
  hits.set(ip, [...recent, Date.now()]);
  return recent.length >= 5;
};

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "Too many requests" }, { status: 429 });
  const lead = parseLead(await request.json().catch(() => null));
  if (!lead) return Response.json({ error: "Invalid submission" }, { status: 400 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("contact: SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY are not set");
    return Response.json({ error: "Contact form unavailable" }, { status: 503 });
  }
  const upstream = await fetch(`${url}/rest/v1/contacts`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(lead),
  }).catch((error: unknown) => {
    console.error("contact: Supabase unreachable", error);
    return null;
  });
  if (!upstream?.ok) {
    console.error("contact: insert failed", upstream?.status, await upstream?.text());
    return Response.json({ error: "Could not save your message" }, { status: 502 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
