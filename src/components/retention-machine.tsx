"use client";

import Image from "next/image";
import {
  BadgeCheck,
  ChevronLeft,
  Clapperboard,
  Clock,
  Eye,
  Grid3x3,
  Heart,
  MoreHorizontal,
  Play,
  SquareUser,
  TrendingUp,
} from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ViewportVideo } from "@/components/viewport-video";
import {
  compactNumber,
  machineClips,
  machineSequence,
  machineStats,
  phaseDuration,
  type MachinePhase,
} from "@/lib/retention-machine";

interface MachineCopy {
  badge: string;
  title: ReactNode;
  raw: string;
  unedited: string;
  rawTag: string;
  editingTag: string;
  status: Record<MachinePhase, string>;
  steps: [string, string, string, string];
  stats: [string, string, string, string];
  posts: string;
  followers: string;
  following: string;
  follow: string;
  message: string;
  bio: [string, string, string];
}

const copy: Record<"en" | "ar", MachineCopy> = {
  en: {
    badge: "How it works",
    title: (
      <>
        Retention <span>Editing Machine</span>
      </>
    ),
    raw: "Raw footage",
    unedited: "Unedited",
    rawTag: "RAW",
    editingTag: "Editing",
    status: { idle: "Ready", travel: "Importing…", editing: "Rendering", drop: "Exported" },
    steps: ["Hook", "Pacing cuts", "Captions", "Retention curve"],
    stats: ["Total views", "Likes & comments", "Avg. watch time", "New followers"],
    posts: "posts",
    followers: "followers",
    following: "following",
    follow: "Follow",
    message: "Message",
    bio: ["ScaleShift", "Retention Editing System™", "Create attention, not just edits."],
  },
  ar: {
    badge: "بيشتغل إزاي",
    title: (
      <>
        ماكينة <span>Retention Editing</span>
      </>
    ),
    raw: "فيديوهات خام",
    unedited: "قبل المونتاج",
    rawTag: "خام",
    editingTag: "مونتاج",
    status: { idle: "جاهز", travel: "بيدخل…", editing: "بيتمنتج", drop: "اتصدّر" },
    steps: ["الهوك", "إيقاع القطعات", "الترجمة", "منحنى الاحتفاظ"],
    stats: ["إجمالي المشاهدات", "لايكات وكومنتات", "متوسط وقت المشاهدة", "متابعين جداد"],
    posts: "منشور",
    followers: "متابع",
    following: "يتابع",
    follow: "متابعة",
    message: "رسالة",
    bio: ["ScaleShift", "Retention Editing System™", "بنصنع الانتباه، مش مجرد مونتاج."],
  },
};

const editingProgress: Record<MachinePhase, number[]> = {
  idle: [0, 0, 0, 0],
  travel: [0, 0, 0, 0],
  editing: [1, 0.8, 0.55, 0.3],
  drop: [1, 1, 1, 1],
};

export function RetentionMachine({ isRtl }: { isRtl: boolean }) {
  const t = isRtl ? copy.ar : copy.en;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const lastStep = machineSequence.length - 1;

  useEffect(() => {
    if (!inView || reduceMotion) return;
    // Hold the full profile for a while, then run the machine again from the raw queue.
    const finished = stepIndex >= lastStep;
    const timer = setTimeout(
      () => setStepIndex(finished ? 0 : stepIndex + 1),
      finished ? 5000 : phaseDuration[machineSequence[stepIndex].phase],
    );
    return () => clearTimeout(timer);
  }, [inView, reduceMotion, stepIndex, lastStep]);

  const { index, phase } = machineSequence[reduceMotion ? lastStep : stepIndex];
  const working = phase === "editing" || phase === "drop";
  const landed = phase === "drop" ? index + 1 : index;
  const current = machineClips[Math.min(index, machineClips.length - 1)];
  const justPublished = phase === "drop" ? machineClips[index] : null;
  const stats = machineStats(landed);
  const queueStart = working ? index + 1 : index;
  const queue = machineClips.slice(queueStart, queueStart + 3);

  return (
    <section id="results" ref={ref} className={`reference-band reference-band-dark retention-machine is-${phase}`}>
      <div className="reference-wrap">
        <div className="reference-section-head is-dark">
          <span className="reference-badge">{t.badge}</span>
          <h2>{t.title}</h2>
        </div>

        <div className="machine">
          <div className="machine-panel machine-raw">
            <h3>
              {t.raw} <small>{t.unedited}</small>
            </h3>
            <div className="machine-queue">
              {queue.map((clip, position) => (
                <div
                  key={clip.id}
                  className={`machine-clip is-pos-${position}${clip === current && phase === "travel" ? " is-travel" : ""}`}
                >
                  {position === 0 ? (
                    <ViewportVideo src={clip.raw} aria-label={`${t.rawTag} ${clip.id}`} />
                  ) : null}
                  <span className="machine-tag">
                    {t.rawTag} {clip.id.slice(-2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="machine-wire" aria-hidden="true">
            <svg viewBox="0 0 80 160">
              <path d="M0 48 C 30 48, 40 80, 80 80" />
              <path d="M0 80 C 30 80, 40 80, 80 80" />
              <path d="M0 112 C 30 112, 40 80, 80 80" />
              <circle cx="4" cy="48" r="3" />
              <circle cx="4" cy="80" r="3" />
              <circle cx="4" cy="112" r="3" />
            </svg>
          </div>

          <div className="machine-system">
            <div className="machine-screen">
              <div className="machine-toolbar">
                <i />
                <i />
                <i />
                <i />
                <em>{t.status[phase]}</em>
              </div>
              <div className={`machine-preview${working ? "" : " is-idle"}`}>
                {working ? (
                  <ViewportVideo key={current.id} src={current.raw} aria-label={`${t.editingTag} ${current.id}`} />
                ) : null}
                <span className="machine-tag is-red">{t.editingTag}</span>
              </div>
              <ul className="machine-progress">
                {t.steps.map((label, step) => (
                  <li key={label}>
                    <b>{label}</b>
                    <span>
                      <i style={{ transform: `scaleX(${editingProgress[phase][step]})` }} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="machine-timeline">
                <i />
                <i />
              </div>
            </div>
            <div className="machine-label" dir="ltr">
              Retention <span>Editing System™</span>
            </div>
          </div>

          <div className="machine-arrow" aria-hidden="true" />

          <div className="ig-phone" dir="ltr">
            <div className="ig-topbar">
              <ChevronLeft size={20} />
              <b>
                scaleshift <BadgeCheck size={14} />
              </b>
              <MoreHorizontal size={20} />
            </div>
            <div className="ig-header">
              <div className="ig-avatar">
                <Image src="/brand/scaleshift-mark.svg" alt="ScaleShift" width={72} height={72} unoptimized />
              </div>
              <ul className="ig-counts">
                <li>
                  <CountUp value={stats.posts} />
                  <span>{t.posts}</span>
                </li>
                <li>
                  <CountUp value={stats.followers} />
                  <span>{t.followers}</span>
                </li>
                <li>
                  <b>1</b>
                  <span>{t.following}</span>
                </li>
              </ul>
            </div>
            <div className="ig-bio">
              <b>{t.bio[0]}</b>
              <p>{t.bio[1]}</p>
              <p>{t.bio[2]}</p>
            </div>
            <div className="ig-actions">
              <span className="is-primary">{t.follow}</span>
              <span>{t.message}</span>
            </div>
            <div className="ig-tabs">
              <span>
                <Grid3x3 size={20} />
              </span>
              <span className="is-active">
                <Clapperboard size={20} />
              </span>
              <span>
                <SquareUser size={20} />
              </span>
            </div>
            <div className="ig-grid">
              {machineClips.map((clip, cell) => (
                <div
                  key={clip.id}
                  className={`ig-cell${cell < landed ? " is-on" : ""}${clip === justPublished ? " is-new" : ""}`}
                >
                  {cell < landed ? (
                    <>
                      <ViewportVideo src={clip.edited} aria-label={`Reel ${clip.id}`} />
                      <b>
                        <Play size={11} fill="currentColor" />
                        <CountUp value={clip.views} from={0} duration={1400} />
                      </b>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <ul className="machine-stats">
            <li>
              <Eye size={22} />
              <div>
                <CountUp value={stats.totalViews} />
                <small>{t.stats[0]}</small>
              </div>
              <em>{justPublished ? `+${compactNumber(justPublished.views)}` : ""}</em>
            </li>
            <li>
              <Heart size={22} />
              <div>
                <CountUp value={stats.likes} />
                <small>{t.stats[1]}</small>
              </div>
              <em>{justPublished ? `+${compactNumber(Math.round(justPublished.views * 0.042))}` : ""}</em>
            </li>
            <li>
              <Clock size={22} />
              <div>
                <CountUp value={stats.watchTime} format={(value) => `${value}%`} />
                <small>{t.stats[2]}</small>
              </div>
              <em>{justPublished ? "▲" : ""}</em>
            </li>
            <li>
              <TrendingUp size={22} />
              <div>
                <CountUp value={stats.newFollowers} format={(value) => `+${compactNumber(value)}`} />
                <small>{t.stats[3]}</small>
              </div>
              <em>{justPublished ? `+${compactNumber(justPublished.followers)}` : ""}</em>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function CountUp({
  value,
  from,
  duration = 900,
  format = compactNumber,
}: {
  value: number;
  from?: number;
  duration?: number;
  format?: (value: number) => string;
}) {
  const reduceMotion = useReducedMotion();
  const shownRef = useRef(from ?? value);
  const [shown, setShown] = useState(from ?? value);

  useEffect(() => {
    const start = shownRef.current;
    if (reduceMotion || start === value) {
      shownRef.current = value;
      return;
    }
    const startedAt = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      shownRef.current = Math.round(start + (value - start) * eased);
      setShown(shownRef.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [value, duration, reduceMotion]);

  return (
    <span className="count-up">
      <span key={value} className="count-pop">
        {format(reduceMotion ? value : shown)}
      </span>
    </span>
  );
}
