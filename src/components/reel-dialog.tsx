"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cachedVideoUrl } from "./viewport-video";

export function ReelDialog({ src, onClose, intro = false, isRtl = false }: { src: string; onClose: () => void; intro?: boolean; isRtl?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return (
    <dialog ref={ref} className={`reel-dialog${intro ? " intro-dialog" : ""}`} aria-label={intro ? (isRtl ? "اتعرف على نظام سكيل شيفت" : "Meet ScaleShift") : "Reel video"} onCancel={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <button className="reel-dialog-close" type="button" onClick={onClose} aria-label={isRtl ? "إغلاق الفيديو" : "Close video"}>
        <X size={22} />
      </button>
      <video src={cachedVideoUrl(src)} poster={intro ? "/intro-poster.jpg" : undefined} playsInline controls autoPlay />
      {intro && <a className="intro-call" href="#contact" onClick={onClose}>{isRtl ? "احجز مكالمة مجانية" : "Book a Free Call"}</a>}
    </dialog>
  );
}
