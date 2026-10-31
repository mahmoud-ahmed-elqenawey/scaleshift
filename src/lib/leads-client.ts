export type Lead = {
  id: string; created_at: string; full_name: string; email: string; phone: string;
  brand_link: string; package: string; budget: string; message: string;
};
export type Session = { access_token: string; refresh_token: string; expires_at: number; email: string };
export type SupabaseConfig = { url: string; apiKey: string };

// Supabase Auth over plain fetch, like /api/contact, so the site needs no client SDK.
export async function requestToken({ url, apiKey }: SupabaseConfig, grant: "password" | "refresh_token", body: object): Promise<Session> {
  const response = await fetch(`${url}/auth/v1/token?grant_type=${grant}`, {
    method: "POST",
    headers: { apikey: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error_description || data.msg || "Sign-in failed");
  return { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at, email: data.user?.email ?? "" };
}

export async function fetchLeads(props: SupabaseConfig, current: Session): Promise<{ session: Session; leads: Lead[] }> {
  const session = current.expires_at * 1000 - Date.now() < 60_000
    ? await requestToken(props, "refresh_token", { refresh_token: current.refresh_token })
    : current;
  const response = await fetch(`${props.url}/rest/v1/contacts?select=*&order=created_at.desc`, {
    headers: { apikey: props.apiKey, Authorization: `Bearer ${session.access_token}` },
  });
  if (response.status === 401) throw new Error("Your session expired. Please sign in again.");
  if (!response.ok) throw new Error("Could not load messages. Try again in a moment.");
  return { session, leads: await response.json() };
}
