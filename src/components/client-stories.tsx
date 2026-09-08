"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cachedVideoUrl } from "./viewport-video";

type Story = { name: string; video: string };
type Review = string;

export function ClientStories({ stories, reviews, rtl }: { stories: Story[]; reviews: Review[]; rtl: boolean }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const story = stories[index];
  const columns = [reviews.filter((_, i) => i % 2 === 0), reviews.filter((_, i) => i % 2 === 1)];

  useEffect(() => {
    if (visible && !reduced) {
      videoRef.current?.play().catch(() => {});
    }
  }, [index, visible, reduced]);

  useEffect(() => {
    const pause = () => { if (document.hidden) videoRef.current?.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => document.removeEventListener("visibilitychange", pause);
  }, []);

  const select = (next: number) => {
    if ((next + stories.length) % stories.length === index) return;
    videoRef.current?.pause();
    setPlaying(false);
    setProgress(0);
    setError(false);
    setIndex((next + stories.length) % stories.length);
  };
  const play = () => {
    setError(false);
    videoRef.current?.play().catch(() => setError(true));
  };
  const toggle = () => { if (playing) videoRef.current?.pause(); else play(); };

  const column = (items: Review[], side: number) => (
    <div className={`client-review-window client-review-window-${side}`}>
      <div className="client-review-track">
        {[0, 1].map(copy => (
          <div className="client-review-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((review) => (
              <figure className="client-review" key={review}>
                <Image src={review} alt={rtl ? "رأي عميل على واتساب" : "Client feedback on WhatsApp"}
                  width={758} height={519} unoptimized loading={visible ? "eager" : "lazy"} />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.section id="testimonials" className={`client-stories${visible && !reduced ? " is-moving" : ""}`}
      onViewportEnter={() => setVisible(true)} onViewportLeave={() => { setVisible(false); videoRef.current?.pause(); }} viewport={{ amount: .1 }}>
      <header className="client-stories-heading">
        <span>{rtl ? "آراء العملاء" : "Testimonials"}</span>
        <h2>{rtl ? "عملاؤنا بيقولوا إيه؟" : "What Clients Say"}</h2>
      </header>
      <div className="client-stories-layout">
        {column(columns[0], 0)}
        <div className={`client-story${playing ? " is-playing" : ""}`}>
          <video key={story.video} ref={videoRef} src={visible ? cachedVideoUrl(story.video) : undefined}
            className="client-story-video" aria-label={story.name} playsInline preload="none" muted={muted}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
            onTimeUpdate={e => { const video = e.currentTarget; if (video.duration) setProgress(video.currentTime / video.duration); }}
            onEnded={() => select(index + 1)} onError={() => setError(true)} />
          <div className="client-story-shade" />
          <div className="client-story-top">
            <div className="client-story-segments" dir="ltr">
              {stories.map((item, i) => (
                <button key={`${item.name}-${i}`} type="button" onClick={() => select(i)} aria-label={`${rtl ? "شاهد" : "Watch"} ${item.name} ${i + 1}`} aria-current={index === i ? "step" : undefined}>
                  <span style={{ width: `${i < index ? 100 : i === index ? progress * 100 : 0}%` }} />
                </button>
              ))}
            </div>
            <div className="client-story-tools">
              <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} title={playing ? "Pause" : "Play"}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
              <button type="button" onClick={() => setMuted(!muted)} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}>{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
            </div>
          </div>
          <button type="button" className="client-story-prev" onClick={() => select(index - 1)} aria-label="Previous testimonial"><ArrowLeft size={19} /></button>
          <button type="button" className="client-story-next" onClick={() => select(index + 1)} aria-label="Next testimonial"><ArrowRight size={19} /></button>
          <div className="client-story-bottom">
            <span>{String(index + 1).padStart(2, "0")} / {stories.length}</span>
            {error && <p role="status">{rtl ? "التسجيل مش متاح دلوقتي، جرّب تاني." : "Unable to play. Please try again."}</p>}
          </div>
        </div>
        {column(columns[1], 1)}
      </div>
    </motion.section>
  );
}
