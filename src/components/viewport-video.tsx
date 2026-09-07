"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

const mediaOrigin = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev";

export function cachedVideoUrl(src: string) {
  return src.startsWith(`${mediaOrigin}/`)
    ? `/api/media?file=${encodeURIComponent(src.slice(mediaOrigin.length))}`
    : src;
}

export function ViewportVideo({
  src,
  active = true,
  ...props
}: Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "autoPlay" | "preload"> & {
  src: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = false;
    const sync = () => {
      if (visible && active && !document.hidden) {
        if (video.getAttribute("src") !== cachedVideoUrl(src)) {
          video.src = cachedVideoUrl(src);
        }
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.01 });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [src, active]);

  return <video {...props} ref={ref} muted loop playsInline preload="none" />;
}
