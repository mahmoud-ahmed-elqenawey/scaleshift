"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Play, VolumeX, X } from "lucide-react";
import { ViewportVideo } from "./viewport-video";
import { ReelDialog } from "./reel-dialog";

const dismissalKey = "scaleshift-intro-dismissed";
const videoUrl = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/Video%20Copy%2001.mp4";

export function IntroVideo({ isRtl }: { isRtl: boolean }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    try { if (sessionStorage.getItem(dismissalKey)) return; } catch { /* Storage may be disabled. */ }
    const timer = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try { sessionStorage.setItem(dismissalKey, "1"); } catch { /* Keep dismissal for this mount. */ }
  }

  return <>
    {visible && <aside className="intro-widget" dir={isRtl ? "rtl" : "ltr"} aria-label={isRtl ? "فيديو تعريفي" : "Studio introduction"}>
      <button type="button" className="intro-dismiss" onClick={dismiss} aria-label={isRtl ? "إخفاء المعاينة" : "Dismiss introduction"}><X size={16} /></button>
      <button type="button" className="intro-launch" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={isRtl ? "شاهد إزاي هنساعدك تطوّر محتواك" : "Watch how we help your content grow"}>
        <span className="intro-thumbnail">
          <ViewportVideo src="/intro-preview.mp4" poster="/intro-poster.jpg" active={!open && !reducedMotion} aria-hidden="true" tabIndex={-1} />
          <span className="intro-play"><Play size={20} fill="currentColor" /></span>
          <VolumeX className="intro-muted" size={14} />
          <span className="intro-duration">3:24</span>
        </span>
        <span className="intro-caption">{isRtl ? "إزاي هنساعدك تطوّر محتواك؟" : "How we help your content grow"}</span>
      </button>
    </aside>}
    {open && <ReelDialog src={videoUrl} intro isRtl={isRtl} onClose={() => setOpen(false)} />}
  </>;
}
