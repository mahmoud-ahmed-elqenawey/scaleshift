"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, VolumeX, X } from "lucide-react";
import { ViewportVideo } from "./viewport-video";
import { ReelDialog } from "./reel-dialog";

const videoUrl = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/Video%20Copy%2001.mp4";

export function IntroVideo({ isRtl }: { isRtl: boolean }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const restoreRef = useRef<HTMLButtonElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const focusAfterToggle = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!focusAfterToggle.current) return;
    (minimized ? restoreRef : launchRef).current?.focus();
  }, [minimized]);

  function togglePreview() {
    focusAfterToggle.current = true;
    setMinimized(value => !value);
  }

  return <>
    {visible && <motion.aside initial={reducedMotion ? false : { opacity: 0, y: 24, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .45 }} className={`intro-widget${minimized ? " intro-widget-mini" : ""}`} dir={isRtl ? "rtl" : "ltr"} aria-label={isRtl ? "فيديو تعريفي" : "Studio introduction"}>
      {minimized ? <button ref={restoreRef} type="button" className="intro-restore" onClick={togglePreview} aria-label={isRtl ? "إظهار معاينة الفيديو" : "Restore video preview"} title={isRtl ? "إظهار معاينة الفيديو" : "Restore video preview"} aria-expanded={false}><Play size={24} fill="currentColor" /></button> : <>
      <button type="button" className="intro-dismiss" onClick={togglePreview} aria-label={isRtl ? "تصغير المعاينة" : "Minimize introduction"} title={isRtl ? "تصغير المعاينة" : "Minimize introduction"}><X size={16} /></button>
      <button ref={launchRef} type="button" className="intro-launch" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={isRtl ? "شاهد إزاي هنساعدك تطوّر محتواك" : "Watch how we help your content grow"}>
        <span className="intro-thumbnail">
          <ViewportVideo src="/intro-preview.mp4" poster="/intro-poster.jpg" active={!open && !reducedMotion} aria-hidden="true" tabIndex={-1} />
          <span className="intro-play"><Play size={20} fill="currentColor" /></span>
          <VolumeX className="intro-muted" size={14} />
          <span className="intro-duration">3:24</span>
        </span>
        <span className="intro-caption">{isRtl ? "إزاي هنساعدك تطوّر محتواك؟" : "How we help your content grow"}</span>
      </button>
      </>}
    </motion.aside>}
    {open && <ReelDialog src={videoUrl} intro isRtl={isRtl} onClose={() => setOpen(false)} />}
  </>;
}
