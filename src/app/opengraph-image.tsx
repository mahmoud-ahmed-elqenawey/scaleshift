import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "ScaleShift — Create attention, not just edits";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link preview card shown on WhatsApp, Facebook, LinkedIn, X, etc. Used by /ar too.
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/scaleshift-logo-new.svg"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 15%, rgba(237,15,36,0.45), #000 55%)",
          color: "#fff",
        }}
      >
        <img src={`data:image/svg+xml;base64,${logo}`} width={380} height={70} alt="" />
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
          <div style={{ display: "flex" }}>
            Create&nbsp;<span style={{ color: "#ed0f24" }}>Attention.</span>
          </div>
          <div style={{ display: "flex", color: "#9a9a9a" }}>Not Just Edits.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#d4d4d4" }}>
          <span>+1B views for 60+ creators &amp; brands</span>
          <span style={{ color: "#fff", fontWeight: 700 }}>scaleshift.uk</span>
        </div>
      </div>
    ),
    size,
  );
}
