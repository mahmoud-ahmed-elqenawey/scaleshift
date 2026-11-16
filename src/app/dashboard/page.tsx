import type { Metadata } from "next";
import { LeadsDashboard } from "@/components/leads-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | ScaleShift",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  const url = process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  return (
    <div className="min-h-screen bg-black text-white">
      {url && apiKey ? (
        <LeadsDashboard url={url} apiKey={apiKey} />
      ) : (
        <p className="px-4 py-8 text-center text-white/70">Dashboard is not configured: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are missing.</p>
      )}
    </div>
  );
}
