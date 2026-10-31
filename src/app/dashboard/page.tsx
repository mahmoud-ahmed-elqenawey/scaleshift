import type { Metadata } from "next";
import { LeadsDashboard } from "@/components/leads-dashboard";

export const metadata: Metadata = {
  title: "Leads | ScaleShift",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  const url = process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-8">
      {url && apiKey ? (
        <LeadsDashboard url={url} apiKey={apiKey} />
      ) : (
        <p className="text-center text-white/70">Dashboard is not configured: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are missing.</p>
      )}
    </main>
  );
}
