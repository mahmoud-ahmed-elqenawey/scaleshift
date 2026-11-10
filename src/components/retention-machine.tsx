"use client";

import Image from "next/image";
import {
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
  UserPlus,
} from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
  rawTag: string;
  editingTag: string;
  status: Record<MachinePhase, string>;
  steps: [string, string, string];
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
        <em className="machine-serif">Retention</em> <span>Editing Machine</span>
      </>
    ),
    raw: "Raw footage",
    rawTag: "RAW",
    editingTag: "Editing",
    status: { idle: "Ready", travel: "Importing…", editing: "Rendering", drop: "Exported" },
    steps: ["Attention Hook", "Retention Structure", "Watch Time Optimization"],
    stats: ["Total views", "Likes & comments", "Avg. watch time", "New followers"],
    posts: "posts",
    followers: "followers",
    following: "following",
    follow: "Follow",
    message: "Message",
    bio: ["Scaleshift", "Media Agency", "Retention Editing System™"],
  },
  ar: {
    badge: "بيشتغل إزاي",
    title: (
      <>
        ماكينة <span><em className="machine-serif">Retention</em> Editing</span>
      </>
    ),
    raw: "فيديوهات خام",
    rawTag: "خام",
    editingTag: "مونتاج",
    status: { idle: "جاهز", travel: "بيدخل…", editing: "بيتمنتج", drop: "اتصدّر" },
    steps: ["Attention Hook", "Retention Structure", "Watch Time Optimization"],
    stats: ["إجمالي المشاهدات", "لايكات وكومنتات", "متوسط وقت المشاهدة", "متابعين جداد"],
    posts: "منشور",
    followers: "متابع",
    following: "يتابع",
    follow: "متابعة",
    message: "رسالة",
    bio: ["Scaleshift", "Media Agency", "Retention Editing System™"],
  },
};

const aeMenu = ["File", "Edit", "Composition", "Layer", "Effect", "Animation", "View", "Window"];
const aeRuler = ["0:00", "0:05", "0:10", "0:15", "0:20", "0:25"];

// Timeline layers as After Effects would stack them (top layer first); stage = which editing step adds it.
const aeLayers: { name: string; color: string; start: number; width: number; stage: number; keys?: number[] }[] = [
  { name: "Hook_Title", color: "#e8794a", start: 0, width: 18, stage: 0, keys: [2, 15] },
  { name: "Zoom_Punch", color: "#d35ea8", start: 3, width: 10, stage: 0, keys: [3, 12] },
  { name: "Cut_02", color: "#5f8fe0", start: 21, width: 31, stage: 1 },
  { name: "Cut_03", color: "#5f8fe0", start: 54, width: 29, stage: 1 },
  { name: "Captions", color: "#e5c54a", start: 2, width: 92, stage: 2, keys: [10, 30, 50, 70, 88] },
  { name: "SFX_Whoosh", color: "#6cc070", start: 19, width: 6, stage: 2 },
  { name: "Raw", color: "#9a8fd6", start: 0, width: 100, stage: -1 },
];

type Box = { left: number; top: number; width: number; height: number };
type Flight = { step: number; from: Box; to: Box };

/** Start/end boxes as CSS variables; the keyframes in globals.css fly between them. */
function flightVars({ from, to }: Flight, phase: MachinePhase): CSSProperties {
  return {
    "--fx": `${from.left}px`,
    "--fy": `${from.top}px`,
    "--fw": `${from.width}px`,
    "--fh": `${from.height}px`,
    "--tx": `${to.left}px`,
    "--ty": `${to.top}px`,
    "--tw": `${to.width}px`,
    "--th": `${to.height}px`,
    "--fly": `${Math.max(200, phaseDuration[phase] - 200)}ms`,
    "--tilt": phase === "drop" ? "7deg" : "-8deg",
  } as CSSProperties;
}

function boxWithin(element: Element, container: Element): Box {
  const rect = element.getBoundingClientRect();
  const base = container.getBoundingClientRect();
  return { left: rect.left - base.left, top: rect.top - base.top, width: rect.width, height: rect.height };
}

export function RetentionMachine({ isRtl }: { isRtl: boolean }) {
  const t = isRtl ? copy.ar : copy.en;
  const ref = useRef<HTMLElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [arrivedStep, setArrivedStep] = useState(-1);
  // Raw clips that failed to load (not uploaded yet) show the edited cut as a stand-in.
  const [missingRaw, setMissingRaw] = useState<ReadonlySet<string>>(new Set());
  const lastStep = machineSequence.length - 1;
  const rawSrc = (clip: (typeof machineClips)[number]) => (missingRaw.has(clip.id) ? clip.edited : clip.raw);
  const onRawError = (id: string) => () =>
    setMissingRaw((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));

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

  // Measure where the flying clip starts and lands for this phase.
  useEffect(() => {
    const machine = machineRef.current;
    if (!machine || reduceMotion || phase === "idle") {
      setFlight(null);
      return;
    }
    const queueFront = machine.querySelector(".machine-clip.is-pos-0");
    const viewer = machine.querySelector(".ae-comp");
    const cell = machine.querySelector(`.ig-cell[data-index="${index}"]`);
    const exportThumb = machine.querySelector(".ae-export-thumb");
    if (!viewer || !cell) return;
    // The clip sits as a 9:16 frame in the middle of the composition viewer.
    const area = boxWithin(viewer, machine);
    const width = Math.min(area.width, (area.height - 8) * (9 / 16));
    const viewerBox = { left: area.left + (area.width - width) / 2, top: area.top + 4, width, height: area.height - 8 };
    if (phase === "travel") {
      setFlight({ step: stepIndex, from: queueFront ? boxWithin(queueFront, machine) : viewerBox, to: viewerBox });
    } else if (phase === "drop") {
      // The finished cut leaves from the export row, not from the preview.
      setFlight({ step: stepIndex, from: exportThumb ? boxWithin(exportThumb, machine) : viewerBox, to: boxWithin(cell, machine) });
    } else {
      setFlight({ step: stepIndex, from: viewerBox, to: viewerBox });
    }
  }, [stepIndex, phase, index, reduceMotion]);

  // Only mount the flyer once this step's start and end boxes are measured, so `initial` is right.
  const activeFlight = flight && flight.step === stepIndex ? flight : null;
  const arrived = reduceMotion || arrivedStep === stepIndex;
  const working = phase === "editing" || phase === "drop";
  const landed = phase === "drop" && arrived ? index + 1 : index;
  const current = machineClips[Math.min(index, machineClips.length - 1)];
  const justPublished = phase === "drop" && arrived ? machineClips[index] : null;
  const stats = machineStats(landed);
  const queueStart = working ? index + 1 : index;
  const queue = machineClips.slice(queueStart, queueStart + 3);
  const flying = activeFlight && phase !== "editing" && !arrived;

  return (
    <section id="results" ref={ref} className={`reference-band reference-band-dark retention-machine is-${phase}`}>
      <div className="reference-wrap">
        <div className="reference-section-head is-dark">
          <span className="reference-badge">{t.badge}</span>
          <h2>{t.title}</h2>
        </div>

        <div className="machine" ref={machineRef}>
          <div className="machine-panel machine-raw">
            <h3>
              {t.raw}
            </h3>
            <div className="machine-queue">
              {queue.map((clip, position) => (
                <div
                  key={clip.id}
                  className={`machine-clip is-pos-${position}${clip === current && phase === "travel" ? " is-lifted" : ""}`}
                >
                  {position === 0 ? (
                    <ViewportVideo src={rawSrc(clip)} onError={onRawError(clip.id)} aria-label={`${t.rawTag} ${clip.id}`} />
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

          <div className="machine-system-wrap">
            <div className="machine-system">
              <div className="ae" dir="ltr" aria-hidden="true">
                <div className="ae-menubar">
                  {aeMenu.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                  <em>reel_{current.id}.aep</em>
                </div>
                <div className="ae-main">
                  <div className="ae-viewer">
                    <div className="ae-tab">Composition: reel_{current.id}</div>
                    <div className={`ae-comp${working ? "" : " is-idle"}`}>
                      {working ? (
                        // The raw clip sits in the preview first; the finished cut fades in over it as rendering runs.
                        <div className={`ae-frame${phase === "drop" ? " is-final" : ""}`}>
                          <ViewportVideo
                            key={`raw-${current.id}`}
                            className="is-raw"
                            src={rawSrc(current)}
                            onError={onRawError(current.id)}
                            aria-label={`${t.rawTag} ${current.id}`}
                          />
                          <ViewportVideo
                            key={`final-${current.id}`}
                            className="is-final"
                            src={current.edited}
                            aria-label={`${t.editingTag} ${current.id}`}
                          />
                          <span className="machine-tag">{t.rawTag}</span>
                          <span className="machine-tag is-red">FINAL</span>
                        </div>
                      ) : null}
                      <i className="ae-safe" />
                    </div>
                    <div className="ae-viewer-bar">
                      <span>{working ? "50%" : "—"}</span>
                      <span className="ae-state">{t.status[phase]}</span>
                      <span className="ae-time">0:00:{String(index).padStart(2, "0")}:12</span>
                    </div>
                  </div>
                  <div className="ae-effects">
                    <div className="ae-tab">Effect Controls</div>
                    <ul>
                      {t.steps.map((label, step) => (
                        <li key={label} style={{ "--i": step } as CSSProperties}>
                          <b>
                            <i>fx</i>
                            {label}
                          </b>
                          <span>
                            <i />
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="ae-export-file">
                      <i className="ae-export-thumb" />
                      <span>reel_{current.id}_final.mp4</span>
                      <em>
                        {phase === "editing" ? (
                          <CountUp value={100} from={0} duration={phaseDuration.editing} format={(value) => `${value}%`} />
                        ) : phase === "drop" ? (
                          "✓ Exported"
                        ) : (
                          "Export"
                        )}
                      </em>
                    </div>
                  </div>
                </div>
                <div className="ae-timeline">
                  <div className="ae-tl-head">
                    <span className="ae-tab">reel_{current.id}</span>
                    <em className="ae-time">0:00:00:00</em>
                  </div>
                  <div className="ae-tl-body">
                    <ul className="ae-layers">
                      {aeLayers.map((layer, row) => (
                        <li key={layer.name}>
                          <i style={{ background: layer.color }} />
                          <small>{row + 1}</small>
                          <span>{layer.stage < 0 ? `Raw_${current.id}.mp4` : layer.name}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="ae-tracks">
                      <div className="ae-ruler">
                        {aeRuler.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                      {aeLayers.map((layer) => (
                        <div key={layer.name} className="ae-track">
                          <i
                            className={`ae-bar${layer.stage < 0 ? " is-base" : ""}`}
                            style={
                              {
                                "--start": layer.start,
                                "--width": layer.width,
                                "--stage": Math.max(0, layer.stage),
                                background: layer.color,
                              } as CSSProperties
                            }
                          />
                          {layer.keys?.map((key) => (
                            <b key={key} style={{ "--at": key, "--stage": layer.stage } as CSSProperties} />
                          ))}
                        </div>
                      ))}
                      <div className="ae-cti">
                        <i />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ae-veil" />
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
              <MoreHorizontal size={20} />
            </div>
            <div className="ig-header">
              <div className="ig-avatar">
                <Image src="/brand/scaleshift-avatar.jpg" alt="ScaleShift" width={88} height={88} unoptimized />
              </div>
              <div className="ig-header-main">
                <b className="ig-handle">
                  scaleshift.uk <MoreHorizontal size={14} />
                </b>
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
            </div>
            <div className="ig-bio">
              <b>{t.bio[0]}</b>
              <p className="is-muted">{t.bio[1]}</p>
              <p>{t.bio[2]}</p>
            </div>
            <div className="ig-actions">
              <span className="is-primary">{t.follow}</span>
              <span>{t.message}</span>
              <span className="is-icon">
                <UserPlus size={13} />
              </span>
            </div>
            <div className="ig-tabs">
              <span className="is-active">
                <Grid3x3 size={20} />
              </span>
              <span>
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
                  data-index={cell}
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

          {activeFlight ? (
            <div
              key={stepIndex}
              className={`machine-flyer is-${phase}${flying ? "" : " is-parked"}`}
              aria-hidden="true"
              style={flightVars(activeFlight, phase)}
              onAnimationEnd={(event) => {
                if (event.animationName === "machine-fly") setArrivedStep(stepIndex);
              }}
            >
              <div className="machine-flyer-lift">
                <ViewportVideo
                  src={phase === "travel" ? rawSrc(current) : current.edited}
                  onError={phase === "travel" ? onRawError(current.id) : undefined}
                  aria-label={`Clip ${current.id}`}
                />
              </div>
            </div>
          ) : null}
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
