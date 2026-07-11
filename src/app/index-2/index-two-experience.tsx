"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Clapperboard,
  Pause,
  Play,
  Scissors,
  Sparkles,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.72,
      ease,
    },
  },
};

const navItems = [
  { label: "Reel Wall", href: "#reel-wall" },
  { label: "Method", href: "#method" },
  { label: "Proof", href: "#proof" },
  { label: "Contact", href: "#contact" },
];

const reelWall = [
  {
    title: "Launch Film",
    category: "Brand reveal",
    note: "Cold open built for replay",
    accent: "#ED0F24",
  },
  {
    title: "Founder Cut",
    category: "Authority reel",
    note: "Message sharpened in 24 frames",
    accent: "#F2EBEB",
  },
  {
    title: "Product Pulse",
    category: "Conversion edit",
    note: "Offer, proof, action",
    accent: "#ED0F24",
  },
  {
    title: "Culture Drop",
    category: "Social proof",
    note: "Paced for retention",
    accent: "#FFFFFF",
  },
];

const shotList = [
  {
    title: "Find the first second",
    body: "We cut through the raw footage until the opening frame has enough tension to stop the scroll.",
    icon: Scissors,
  },
  {
    title: "Build the rhythm map",
    body: "Every beat gets a reason: voice, caption, sound hit, pause, proof, and release.",
    icon: AudioLines,
  },
  {
    title: "Shape the reel world",
    body: "Color, type, masks, captions, and pacing are tuned so the edit feels native to your brand.",
    icon: Clapperboard,
  },
  {
    title: "Package for action",
    body: "The final cut is exported with the hook, caption direction, and CTA working as one system.",
    icon: Sparkles,
  },
];

const proofPoints = [
  "100+ videos delivered",
  "Millions of views generated",
  "Consistent growth in engagement and retention",
];

const tickerItems = [
  "Hook density",
  "Sound design",
  "Retention pacing",
  "Caption hierarchy",
  "Platform-ready exports",
  "Thumbnail direction",
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.34 }}
      variants={reveal}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function CtaLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      className={variant === "primary" ? styles.primaryCta : styles.ghostCta}
      href={href}
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
    >
      {children}
      <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
    </motion.a>
  );
}

export default function IndexTwoExperience() {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeShot, setActiveShot] = useState(0);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.34]);

  useEffect(() => {
    if (!isPlaying || shouldReduceMotion) {
      return;
    }

    const id = window.setInterval(() => {
      setActiveShot((current) => (current + 1) % shotList.length);
    }, 2200);

    return () => window.clearInterval(id);
  }, [isPlaying, shouldReduceMotion]);

  return (
    <main
      className={styles.page}
      style={{ "--active-shot": activeShot } as CSSProperties}
    >
      <header className={styles.header}>
        <Link className={styles.logoLink} href="/" aria-label="ScaleShift home">
          <Image
            src="/brand/scaleshift-logo-red-white-transparent.png"
            alt="ScaleShift"
            width={215}
            height={60}
            priority
          />
        </Link>
        <nav className={styles.nav} aria-label="Index 2 demo navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className={styles.headerCta} href="#contact">
          Book a call
          <ArrowRight aria-hidden="true" size={15} strokeWidth={2.4} />
        </a>
      </header>

      <section ref={heroRef} className={styles.hero}>
        <motion.div
          className={styles.heroImage}
          style={shouldReduceMotion ? undefined : { y: heroImageY }}
          aria-hidden="true"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.filmEdgeLeft} aria-hidden="true" />
        <div className={styles.filmEdgeRight} aria-hidden="true" />
        <div className={styles.redScan} aria-hidden="true" />

        <motion.div
          className={styles.heroContent}
          style={shouldReduceMotion ? undefined : { y: heroTextY, opacity: heroOpacity }}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.65, ease }}
        >
          <motion.h1
            initial={shouldReduceMotion ? false : { y: 42, clipPath: "inset(0 0 100% 0)" }}
            animate={shouldReduceMotion ? undefined : { y: 0, clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 0.9, delay: 0.12, ease }}
          >
            Edit like the feed has a pulse.
          </motion.h1>
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.34, ease }}
          >
            ScaleShift turns raw footage into cinematic short-form cuts that
            feel sharp, hold attention, and move viewers toward action.
          </motion.p>
          <motion.div
            className={styles.heroActions}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: 0.48, ease }}
          >
            <CtaLink href="#contact">Book Your Free Strategy Call</CtaLink>
            <motion.button
              className={styles.watchButton}
              type="button"
              onClick={() => setIsPlaying((value) => !value)}
              aria-pressed={isPlaying}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2, ease }}
            >
              {isPlaying ? (
                <Pause aria-hidden="true" size={17} fill="currentColor" />
              ) : (
                <Play aria-hidden="true" size={17} fill="currentColor" />
              )}
              {isPlaying ? "Pause The Cut" : "Watch The Cut"}
            </motion.button>
          </motion.div>
        </motion.div>

        <div className={styles.heroTimeline} aria-label="Animated edit timeline preview">
          <span className={styles.timecode}>00:00:{String(14 + activeShot * 3).padStart(2, "0")}</span>
          <div className={styles.timelineTrack}>
            {Array.from({ length: 30 }, (_, index) => (
              <span
                key={index}
                className={styles.timelineFrame}
                style={{ "--frame": index } as CSSProperties}
              />
            ))}
            <span
              className={`${styles.playhead} ${isPlaying ? styles.playheadRunning : ""}`}
            />
          </div>
        </div>
      </section>

      <section id="reel-wall" className={styles.reelWall}>
        <Reveal className={styles.sectionIntro}>
          <p className={styles.statement}>
            The page behaves like an edit: one focal frame, one cut mark, one
            reason to keep scrolling.
          </p>
          <h2>Reels that feel engineered, not decorated.</h2>
        </Reveal>

        <div className={styles.wallGrid}>
          {reelWall.map((reel, index) => (
            <Reveal
              key={reel.title}
              className={`${styles.reelTile} ${index === 1 ? styles.reelTileWide : ""}`}
              delay={index * 0.06}
            >
              <div
                className={styles.reelVisual}
                style={{ "--tile-accent": reel.accent, "--tile": index } as CSSProperties}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>
              <div className={styles.reelCopy}>
                <p>{reel.category}</p>
                <h3>{reel.title}</h3>
                <span>{reel.note}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="method" className={styles.method}>
        <div className={styles.methodBackdrop} aria-hidden="true" />
        <Reveal className={styles.methodHeader}>
          <h2>A director&apos;s shot list for the social feed.</h2>
          <p>
            Every ScaleShift edit moves through a clear sequence: hook,
            rhythm, brand world, and publish-ready action.
          </p>
        </Reveal>

        <div className={styles.shotList} role="list" aria-label="ScaleShift editing method">
          {shotList.map((shot, index) => {
            const Icon = shot.icon;
            const isActive = activeShot === index;

            return (
              <button
                key={shot.title}
                className={`${styles.shotItem} ${isActive ? styles.shotItemActive : ""}`}
                type="button"
                onClick={() => {
                  setActiveShot(index);
                  setIsPlaying(false);
                }}
                aria-current={isActive ? "step" : undefined}
              >
                <span className={styles.shotNumber}>0{index + 1}</span>
                <span className={styles.shotIcon}>
                  <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                </span>
                <span className={styles.shotBody}>
                  <strong>{shot.title}</strong>
                  <span>{shot.body}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="proof" className={styles.proof}>
        <Reveal className={styles.proofText}>
          <h2>Proof without the template theater.</h2>
          <p>
            Scaleshift keeps the promise simple: make the footage sharper,
            make the message clearer, and package the cut for the platform it
            has to survive on.
          </p>
        </Reveal>
        <div className={styles.proofRows}>
          {proofPoints.map((point, index) => (
            <Reveal key={point} className={styles.proofRow} delay={index * 0.07}>
              <span>0{index + 1}</span>
              <p>{point}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.tickerSection} aria-label="ScaleShift editing capabilities">
        <div className={styles.tickerTrack}>
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <section id="contact" className={styles.finalCtaSection}>
        <div className={styles.finalLight} aria-hidden="true" />
        <Reveal className={styles.finalContent}>
          <h2>Bring the raw footage. We&apos;ll find the cut.</h2>
          <p>
            A new ScaleShift demo route built as a cinematic edit surface:
            sharp, black, red, bright where it matters.
          </p>
          <div className={styles.finalActions}>
            <Link className={styles.primaryCta} href="/">
              Keep the original home
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
            </Link>
            <CtaLink href="#reel-wall" variant="ghost">
              Replay the demo
            </CtaLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
