"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

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
        if (video.getAttribute("src") !== src) {
          video.src = src;
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
