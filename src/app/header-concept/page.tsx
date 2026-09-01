"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const conceptReels = [
  {
    label: "Portfolio reel 001",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/001.mp4",
  },
  {
    label: "Portfolio reel 002",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/002.mp4",
  },
  {
    label: "Portfolio reel 003",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/003.mp4",
  },
  {
    label: "Portfolio reel 004",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/004.mp4",
  },
  {
    label: "Portfolio reel 005",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/005.mp4",
  },
  {
    label: "Portfolio reel 006",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/006.mp4",
  },
  {
    label: "Portfolio reel 007",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/007.mp4",
  },
  {
    label: "Portfolio reel 008",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/008.mp4",
  },
  {
    label: "Portfolio reel 009",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/009.mp4",
  },
  {
    label: "Portfolio reel 010",
    src: "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/portfolio/0010.mp4",
  },
];

export default function HeaderConcept() {
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1024);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      setOrbitAngle(((now - startedAt) / 28000) * 360);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const radiusX = viewportWidth < 640 ? 176 : viewportWidth < 900 ? 282 : 410;
  const radiusY = viewportWidth < 640 ? 250 : viewportWidth < 900 ? 345 : 430;

  return (
    <main className="concept-page">
      <section className="concept-hero" aria-label="Alternative ScaleShift hero concept">
        <header className="concept-nav">
          <Link href="/" aria-label="Back to ScaleShift homepage">
            <Image
              src="/brand/scaleshift-logo-mixed.jpg"
              alt="Scaleshift"
              width={644}
              height={180}
              priority
            />
          </Link>
          <nav aria-label="Concept navigation">
            <Link href="/">Current home</Link>
            <Link href="/ar">Arabic</Link>
          </nav>
        </header>

        <div className="concept-copy">
          <p>ScaleShift Studio</p>
          <h1>
            Content That Holds
            <span>Attention</span>
          </h1>
          <p>
            We turn raw ideas into sharp, high-retention reels designed to look premium
            and push viewers toward action.
          </p>
        </div>

        <div className="concept-orbit" aria-hidden="true">
          <div className="concept-reel-orbit">
            {conceptReels.map((reel, index) => (
              <OrbitReel
                key={reel.src}
                reel={reel}
                index={index}
                count={conceptReels.length}
                orbitAngle={orbitAngle}
                radiusX={radiusX}
                radiusY={radiusY}
              />
            ))}
          </div>
        </div>

        <div className="concept-actions">
          <Link href="/#contact">Book Strategy Call</Link>
          <p>Reels editing | Strategy | Retention system</p>
        </div>
      </section>
    </main>
  );
}

function OrbitReel({
  reel,
  index,
  count,
  orbitAngle,
  radiusX,
  radiusY,
}: {
  reel: { label: string; src: string };
  index: number;
  count: number;
  orbitAngle: number;
  radiusX: number;
  radiusY: number;
}) {
  const angle = orbitAngle + (index / count) * 360 - 96;
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * radiusX;
  const arc = Math.sin(radians);
  const y = -arc * radiusY;
  const centerWeight = Math.max(0, 1 - Math.abs(x) / radiusX);
  const reveal = Math.max(0, Math.min(1, (arc - 0.005) / 0.24));
  const scale = 0.78 + centerWeight * 0.22;
  const opacity = reveal * (0.32 + centerWeight * 0.68);
  const normalizedAngle = ((angle % 360) + 360) % 360;
  const orbitRotation = 90 - normalizedAngle;
  const blur = (1 - centerWeight) * 0.45;

  return (
    <div
      className="concept-card concept-card-reel"
      style={
        {
          opacity,
          pointerEvents: opacity > 0.2 ? "auto" : "none",
          zIndex: Math.round((centerWeight + reveal) * 20),
          filter: `saturate(1.05) blur(${blur.toFixed(2)}px)`,
          transform: `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${orbitRotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
        } as CSSProperties
      }
    >
      <video
        src={reel.src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={reel.label}
        onCanPlay={(event) => {
          event.currentTarget.play().catch(() => undefined);
        }}
      />
    </div>
  );
}
