"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cachedVideoUrl } from "./viewport-video";

export function ReelDialog({ src, onClose }: { src: string; onClose: () => void }) {
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
    <dialog ref={ref} className="reel-dialog" aria-label="Reel video" onCancel={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <button className="reel-dialog-close" type="button" onClick={onClose} aria-label="Close video">
        <X size={22} />
      </button>
      <video src={cachedVideoUrl(src)} playsInline controls autoPlay />
    </dialog>
  );
}
