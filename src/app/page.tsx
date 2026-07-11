"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const cinematicEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.18,
      staggerChildren: 0.1,
    },
  },
};

const heroItem: Variants = {
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
      duration: 0.85,
      ease: cinematicEase,
    },
  },
};

const sectionReveal = {
  initial: {
    opacity: 0,
    y: 42,
    filter: "blur(14px)",
  },
  whileInView: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

export const englishContent = {
  locale: "en",
  dir: "ltr",
  isRtl: false,
  homeHref: "/",
  alternateHref: "/ar",
  alternateLabel: "عربي",
  logoLabel: "ScaleShift home",
  navLabel: "Primary",
  footerNavLabel: "Footer",
  nav: {
    work: "Work",
    services: "Services",
    process: "Process",
    results: "Results",
    contact: "Contact",
  },
  hero: {
    label: "Content that performs",
    headline: "Turn Your Content Into a",
    highlight: "Revenue Machine",
    subheadline:
      "We help creators and brands scale their content with high-performing videos that grab attention, build authority, and convert viewers into paying clients.",
    primaryCta: "Book Your Free Strategy Call",
    secondaryCta: "See the process",
    builtLabel: "Built to",
    builtItems: ["Stop the scroll", "Build trust", "Drive action", "Scale revenue"],
    reelCaption: "Growth edit",
    orbitTop: "Stop the scroll",
    orbitBottom: "Build trust",
    proofLabel: "Performance proof",
  },
  portfolio: {
    headline: "See the work before the pitch.",
    description:
      "Designed reel frames show the pacing, packaging, and visual direction Scaleshift builds before real client cuts are added.",
    note: "Designed sample frames - no client names",
    frames: [
      {
        title: "Hook-first opener",
        category: "Retention edit",
        note: "A sharp first second, readable captions, and rhythm that keeps the viewer moving.",
        tags: ["9:16", "Hook", "Captions"],
      },
      {
        title: "Authority cut",
        category: "Founder / expert reel",
        note: "Talking-head footage shaped into a confident message with clean pauses and emphasis.",
        tags: ["Trust", "Pacing", "Audio"],
      },
      {
        title: "Offer-driven edit",
        category: "Conversion reel",
        note: "The idea, proof, and next step packaged into one clear short-form sequence.",
        tags: ["Offer", "Proof", "CTA"],
      },
      {
        title: "Thumbnail direction",
        category: "Scroll-stop package",
        note: "A clear cover concept that makes the idea understandable before the video plays.",
        tags: ["Cover", "CTR", "Clarity"],
      },
    ],
    flow: ["Raw idea", "Hook", "Cut rhythm", "Cover direction", "Publish-ready"],
  },
  proof: {
    headline: "Built for Results. Proven by Performance.",
    stats: [
      "100+ videos delivered",
      "Millions of views generated",
      "Consistent growth in engagement & retention",
    ],
    testimonials: [
      "My content finally looks premium - and the numbers back it up.",
      "I stopped guessing what works. Everything now feels intentional.",
      "Fast, reliable, and the quality is on another level.",
    ],
  },
  pain: {
    headline: "You're Posting... But Nothing's Really Changing",
    description:
      "You're putting in the time. You're showing up. But the growth? The engagement? The conversions? Still not where they should be.",
    points: [
      "Your content isn't holding attention",
      "Editing is draining your time and energy",
      "You're blending in instead of standing out",
      "There's no clear system behind your content",
    ],
  },
  solution: {
    headline: "We Turn Content Into",
    highlight: "Growth",
    description:
      "ScaleShift isn't just an editing service - we're your content growth partner. Everything we create is designed to perform, not just look good.",
    cta: "See the process",
    services: [
      "High-retention video editing that keeps viewers watching",
      "Thumbnails designed to stop the scroll and drive clicks",
      "Script and content support to sharpen your message",
      "A clear strategy built around your growth goals",
    ],
  },
  serviceBreakdown: [
    {
      title: "Video Editing",
      summary: "Clean, modern, high-end edits built to hold attention.",
      points: [
        "Clean, modern, high-end editing style",
        "Fast pacing that keeps viewers engaged",
        "Professional sound design for a premium feel",
        "Optimized for performance across platforms",
      ],
    },
    {
      title: "Thumbnails",
      summary: "CTR-focused visuals designed to stop the scroll.",
      points: [
        "Designed to maximize clicks",
        "Bold, attention-grabbing visuals",
        "Backed by real performance insights",
      ],
    },
    {
      title: "Content Strategy",
      summary: "Hooks, ideas, and systems shaped around growth.",
      points: [
        "Hooks that capture attention instantly",
        "Content engineered for reach and virality",
        "Growth-focused ideas tailored to your niche",
      ],
    },
  ],
  process: {
    headline: "From raw content to a repeatable growth system.",
    description:
      "We combine editing, packaging, and content strategy so every publish has a clearer job: earn attention, hold it, and move people toward action.",
    steps: [
      "Book a free strategy call",
      "We break down your content, audience, and goals",
      "We execute and continuously optimize",
      "You scale your content and results",
    ],
  },
  why: {
    headline: "Why ScaleShift?",
    reasons: [
      "We care about results - not just visuals",
      "We understand platforms, algorithms, and audience psychology",
      "Fast turnaround without compromising quality",
      "Built specifically for creators who want to grow",
      "Every decision is backed by strategy, not guesswork",
    ],
  },
  offer: {
    headline: "Content That Pays for Itself",
    description:
      "No one-size-fits-all packages. We tailor everything based on your goals, volume, and growth stage.",
    details: [
      "Flexible monthly plans or per-video pricing",
      "Scalable as your content grows",
      "Built for long-term success, not short-term fixes",
    ],
    cta: "Get Your Custom Plan",
  },
  finalCta: {
    headline: "Ready to Scale?",
    description:
      "If you're serious about growing your content and turning it into a real income stream - this is your next step.",
    cta: "Book Your Call Now",
    note: "Instagram DM link placeholder",
  },
  footer: {
    social: "Social Media",
    contact: "Contact",
    privacy: "Privacy Policy",
    copyright: "© ScaleShift. All rights reserved.",
  },
};

export const arabicContent = {
  ...englishContent,
  locale: "ar",
  dir: "rtl",
  isRtl: true,
  homeHref: "/ar",
  alternateHref: "/",
  alternateLabel: "EN",
  logoLabel: "العودة إلى صفحة ScaleShift الرئيسية",
  navLabel: "التنقل الرئيسي",
  footerNavLabel: "روابط التذييل",
  nav: {
    work: "الأعمال",
    services: "الخدمات",
    process: "الطريقة",
    results: "النتائج",
    contact: "تواصل",
  },
  hero: {
    label: "مونتاج ريلز مبني على الأداء",
    headline: "خلّي محتواك يلفت الانتباه",
    highlight: "ويجيب عملاء",
    subheadline:
      "نحوّل أفكارك ومقاطعك إلى ريلز قصيرة بإيقاع سريع، رسالة واضحة، وشكل احترافي يساعدك تظهر أقوى وتحول المشاهدة إلى طلبات حقيقية.",
    primaryCta: "احجز استشارة مجانية",
    secondaryCta: "اعرف طريقتنا",
    builtLabel: "كل فيديو يشتغل على",
    builtItems: ["هوك أقوى", "احتفاظ أطول", "رسالة أوضح", "طلب حقيقي"],
    reelCaption: "ريل نمو",
    orbitTop: "هوك أقوى",
    orbitBottom: "احتفاظ أطول",
    proofLabel: "مؤشرات الأداء",
  },
  portfolio: {
    headline: "شوف شكل الشغل قبل ما تاخد قرار.",
    description:
      "دي نماذج ريلز مصممة توضح طريقة المونتاج، التغليف، والإيقاع لحد ما نضيف أعمال العملاء الحقيقية.",
    note: "نماذج مصممة بدون أسماء عملاء",
    frames: [
      {
        title: "بداية بخطّاف واضح",
        category: "ريل احتفاظ",
        note: "أول ثانية تشد، كابشن مقروء، وقطع سريع من غير دوشة.",
        tags: ["9:16", "هوك", "كابشن"],
      },
      {
        title: "فيديو ثقة",
        category: "خبير أو مؤسس",
        note: "ترتيب الكلام والوقفات عشان الرسالة تبان أوضح وأقوى.",
        tags: ["ثقة", "إيقاع", "صوت"],
      },
      {
        title: "عرض مباشر",
        category: "ريل تحويل",
        note: "الفكرة، الدليل، والخطوة الجاية في تسلسل قصير وواضح.",
        tags: ["عرض", "دليل", "CTA"],
      },
      {
        title: "غلاف يوقف التمرير",
        category: "تغليف الفيديو",
        note: "عنوان وتكوين بصري يخلي الفكرة تتفهم قبل تشغيل الفيديو.",
        tags: ["غلاف", "ضغط", "وضوح"],
      },
    ],
    flow: ["الفكرة الخام", "الهوك", "إيقاع القص", "اتجاه الغلاف", "جاهز للنشر"],
  },
  proof: {
    headline: "شغل شكله احترافي وهدفه واضح.",
    stats: [
      "أكثر من 100 فيديو تم تسليمه",
      "ملايين المشاهدات على محتوى العملاء",
      "تحسّن مستمر في التفاعل والاحتفاظ",
    ],
    testimonials: [
      "أول مرة أحس إن محتواي شكله احترافي وبيخدم هدفي.",
      "بقينا نعرف ننشر إيه وليه، مش مجرد نجرب.",
      "الشغل سريع ومنظم، والنتيجة أعلى من توقعاتي.",
    ],
  },
  pain: {
    headline: "بتنشر كتير... بس النتيجة مش على قد المجهود",
    description:
      "المشكلة غالباً مش إنك مش بتظهر. المشكلة إن الفيديو مش ماسك الانتباه، والرسالة مش واضحة كفاية، وكل منشور بيتعامل كأنه تجربة منفصلة.",
    points: [
      "أول ثواني في الفيديو مش بتشد المشاهد",
      "المونتاج واخد وقتك بدل ما تركز على شغلك",
      "شكل المحتوى قريب من أي حد في السوق",
      "مفيش نظام واضح للأفكار، الهوكات، والنشر",
    ],
  },
  solution: {
    headline: "نحوّل أفكارك ومقاطعك إلى",
    highlight: "محتوى يشتغل",
    description:
      "نشتغل على الفيديو كجزء من رحلة نمو، مش كملف محتاج قص ولصق. كل قرار في الإيقاع، النص، الغلاف، والصوت هدفه يخلي المحتوى أوضح وأسهل في التحويل.",
    cta: "اعرف طريقتنا",
    services: [
      "مونتاج ريلز سريع الإيقاع يحافظ على المشاهدة",
      "أغلفة فيديو توقف التمرير وتوضح الفكرة بسرعة",
      "مساعدة في الهوكات والسكريبت عشان الرسالة تبقى أقوى",
      "خطة محتوى تناسب هدفك وجمهورك، مش قالب جاهز",
    ],
  },
  serviceBreakdown: [
    {
      title: "مونتاج الريلز",
      summary: "نحوّل المقاطع اللي عندك لفيديو سريع، واضح، وشكله احترافي.",
      points: [
        "بداية قوية تخلي المشاهد يكمل",
        "إيقاع مناسب للريلز والشورتس",
        "صوت وانتقالات تخدم الرسالة مش تشتتها",
        "نسخ جاهزة للنشر على المنصات المختلفة",
      ],
    },
    {
      title: "أغلفة الفيديو",
      summary: "غلاف واضح وقوي يخلي الناس تفهم الفكرة وتضغط.",
      points: [
        "فكرة الغلاف واضحة من أول نظرة",
        "تصميم جريء من غير زحمة بصرية",
        "اختيارات مبنية على قابلية الضغط والمشاهدة",
      ],
    },
    {
      title: "استراتيجية المحتوى",
      summary: "أفكار وهوكات تساعدك تنشر بنظام، مش بعشوائية.",
      points: [
        "هوكات مناسبة لجمهورك وطبيعة عرضك",
        "زوايا محتوى تخدم الوصول والثقة والتحويل",
        "أفكار قابلة للتكرار والتطوير مع الوقت",
      ],
    },
  ],
  process: {
    headline: "نشتغل بنظام واضح من أول مكالمة لحد النشر.",
    description:
      "نفهم هدفك والجمهور اللي بتكلمه، نطلع زاوية المحتوى، وبعدها ننفذ ونحسّن بناءً على الأداء.",
    steps: [
      "تحجز استشارة سريعة نفهم فيها هدفك",
      "نراجع محتواك والجمهور اللي عايز توصله",
      "نجهز الأفكار، المونتاج، والغلاف",
      "نراجع الأداء ونطوّر الاتجاه مع الوقت",
    ],
  },
  why: {
    headline: "لماذا ScaleShift؟",
    reasons: [
      "نفكر في النتيجة قبل شكل الفيديو",
      "نفهم سلوك المشاهد على السوشيال، مش المونتاج بس",
      "تسليم سريع من غير ما الجودة تقع",
      "مناسب لصناع محتوى وبراندات عايزة تكبر بجد",
      "كل تعديل له سبب، مش مجرد مؤثرات زيادة",
    ],
  },
  offer: {
    headline: "خطة تناسب هدفك وحجم محتواك",
    description:
      "مش كل براند محتاج نفس عدد الفيديوهات أو نفس طريقة الشغل. نحدد الخطة حسب هدفك، حجم النشر، والمرحلة اللي أنت فيها.",
    details: [
      "اشتراك شهري أو تسعير حسب عدد الفيديوهات",
      "خطة قابلة للزيادة مع نمو المحتوى",
      "تركيز على علاقة طويلة المدى مش شغل مرة واحدة",
    ],
    cta: "اطلب خطة تناسبك",
  },
  finalCta: {
    headline: "جاهز تخلي المحتوى يشتغل بجد؟",
    description:
      "لو عايز محتوى شكله أقوى، رسالته أوضح، ونتيجته أحسن، خلينا نبدأ بخطوة بسيطة ونشوف الأنسب لك.",
    cta: "احجز استشارتك المجانية",
    note: "رابط الانستجرام أو الحجز هيتضاف هنا",
  },
  footer: {
    social: "حساباتنا",
    contact: "تواصل",
    privacy: "الخصوصية",
    copyright: "© ScaleShift. جميع الحقوق محفوظة.",
  },
};

type SiteContent = typeof englishContent;

function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.72, delay, ease: cinematicEase }}
    >
      {children}
    </motion.div>
  );
}

function ButtonLink({
  href,
  children,
  variant = "red",
  rtl = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "red" | "black" | "text";
  rtl?: boolean;
}) {
  const className =
    variant === "text"
      ? "motion-link inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-white underline decoration-brand-red/70 underline-offset-8 transition hover:text-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
      : variant === "black"
        ? "motion-link inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-black px-6 py-3 text-sm font-semibold text-brand-off-white transition hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
        : "motion-link motion-link-red inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-brand-white shadow-[0_10px_24px_rgba(237,15,36,0.24)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-white";
  const shouldReduceMotion = useReducedMotion();
  const ArrowIcon = rtl ? ArrowLeft : ArrowRight;

  return (
    <motion.a
      href={href}
      className={className}
      whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: cinematicEase }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="inline-flex"
        animate={shouldReduceMotion ? undefined : { x: [0, rtl ? -4 : 4, 0] }}
        transition={{
          duration: 1.7,
          repeat: Infinity,
          repeatDelay: 1.4,
          ease: cinematicEase,
        }}
      >
        <ArrowIcon size={17} strokeWidth={2} />
      </motion.span>
    </motion.a>
  );
}

function ReelPreview({
  content,
  y,
  rotate,
  scale,
}: {
  content: SiteContent;
  y?: MotionValue<number>;
  rotate?: MotionValue<number>;
  scale?: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="reel-orbit"
      aria-hidden="true"
      style={shouldReduceMotion ? undefined : { y, rotate, scale }}
      variants={heroItem}
    >
      <motion.div
        className="reel-device"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 80, rotateX: 16 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.48, ease: cinematicEase }}
      >
        <div className="reel-screen">
          <div className="reel-bars">
            <span />
            <span />
          </div>
          <div className="reel-subject" />
          <div className="reel-scan" />
          <div className="reel-cut reel-cut-one" />
          <div className="reel-cut reel-cut-two" />
          <div className="reel-play">
            <Play size={30} fill="currentColor" strokeWidth={1.5} />
          </div>
          <div className="reel-caption">
            <span>00:18</span>
            <span>{content.hero.reelCaption}</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="orbit-note orbit-note-top"
        initial={shouldReduceMotion ? false : { opacity: 0, x: -18 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 1.05, ease: cinematicEase }}
      >
        {content.hero.orbitTop}
      </motion.div>
      <motion.div
        className="orbit-note orbit-note-bottom"
        initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 1.18, ease: cinematicEase }}
      >
        {content.hero.orbitBottom}
      </motion.div>
    </motion.div>
  );
}

function TimelineStrip({ x }: { x?: MotionValue<number> }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="timeline-strip"
      aria-hidden="true"
      style={shouldReduceMotion ? undefined : { x }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 34, clipPath: "inset(0 100% 0 0)" }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 1.1, delay: 0.8, ease: cinematicEase }}
    >
      <div className="timeline-times">
        <span>00:00</span>
        <span>00:05</span>
        <span>00:10</span>
        <span>00:30</span>
        <span>00:40</span>
      </div>
      <div className="timeline-track">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            className="timeline-thumb"
            style={{ "--thumb": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="timeline-playhead" />
      <div className="waveform">
        {Array.from({ length: 44 }, (_, index) => (
          <span
            key={index}
            style={{ "--wave-index": index } as CSSProperties}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SectionHeading({
  title,
  children,
  dark = false,
}: {
  title: React.ReactNode;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2
        className={`text-balance text-4xl font-semibold leading-none tracking-[-0.03em] sm:text-5xl lg:text-6xl ${
          dark ? "text-brand-white" : "text-brand-black"
        }`}
      >
        {title}
      </h2>
      {children ? (
        <p
          className={`mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 sm:text-lg ${
            dark ? "text-white/70" : "text-neutral-700"
          }`}
        >
          {children}
        </p>
      ) : null}
    </div>
  );
}

function PortfolioShowcase({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="work" className="portfolio-showcase bg-brand-off-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="portfolio-header">
          <Reveal className="portfolio-heading">
            <p>{content.portfolio.note}</p>
            <h2>{content.portfolio.headline}</h2>
          </Reveal>
          <Reveal className="portfolio-description" delay={0.08}>
            <p>{content.portfolio.description}</p>
          </Reveal>
        </div>

        <div className="portfolio-wall" role="list" aria-label={content.portfolio.headline}>
          {content.portfolio.frames.map((frame, index) => (
            <motion.article
              key={frame.title}
              role="listitem"
              className="portfolio-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 44, scale: 0.97 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.76, delay: index * 0.08, ease: cinematicEase }}
              whileHover={shouldReduceMotion ? undefined : { y: index % 2 === 0 ? -10 : -18, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
            >
              <div
                className="portfolio-media"
                style={
                  {
                    "--portfolio-index": index,
                    "--portfolio-delay": `${index * 0.18}s`,
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                <div className="portfolio-screen">
                  <span className="portfolio-face" />
                  <span className="portfolio-caption-line portfolio-caption-line-one" />
                  <span className="portfolio-caption-line portfolio-caption-line-two" />
                  <span className="portfolio-playhead" />
                </div>
                <div className="portfolio-chip-row">
                  {frame.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="portfolio-copy">
                <p>{frame.category}</p>
                <h3>{frame.title}</h3>
                <span>{frame.note}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="portfolio-flow"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.72, delay: 0.18, ease: cinematicEase }}
        >
          {content.portfolio.flow.map((item, index) => (
            <span key={item} style={{ "--flow-index": index } as CSSProperties}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SocialProof({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="proof" className="bg-brand-off-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading title={content.proof.headline} />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 lg:grid-cols-3">
          {content.proof.stats.map((stat, index) => (
            <motion.div
              key={stat}
              className="bg-brand-off-white p-8 text-center lg:p-10"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.62, delay: index * 0.08, ease: cinematicEase }}
            >
              <p className="text-3xl font-semibold tracking-[-0.03em] text-brand-black sm:text-4xl">
                {stat}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {content.proof.testimonials.map((quote, index) => (
            <motion.figure
              key={quote}
              className="border border-black/10 bg-white/50 p-7 backdrop-blur-sm"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.65, delay: 0.12 + index * 0.07, ease: cinematicEase }}
            >
              <blockquote className="text-pretty text-xl font-medium leading-8 tracking-[-0.01em] text-brand-black">
                &quot;{quote}&quot;
              </blockquote>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function PainPoints({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-black px-5 py-20 text-brand-white sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-24">
          <h2 className="max-w-xl text-balance text-4xl font-semibold leading-none tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {content.pain.headline}
          </h2>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-white/70">
            {content.pain.description}
          </p>
        </Reveal>

        <div className="space-y-3">
          {content.pain.points.map((point, index) => (
            <motion.div
              key={point}
              className="group flex items-center gap-5 border-b border-white/10 py-6"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 42 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: cinematicEase }}
            >
              <span className="text-sm font-semibold text-brand-red">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-2xl font-semibold tracking-[-0.02em] text-white/90 transition group-hover:text-brand-red">
                {point}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="bg-brand-off-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <h2 className="text-balance text-4xl font-semibold leading-none tracking-[-0.03em] text-brand-black sm:text-5xl lg:text-6xl">
            {content.solution.headline}{" "}
            <span className="text-brand-red">{content.solution.highlight}</span>
          </h2>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-neutral-700">
            {content.solution.description}
          </p>
          <div className="mt-9">
            <ButtonLink href="#process" variant="black" rtl={content.isRtl}>
              {content.solution.cta}
            </ButtonLink>
          </div>
        </Reveal>

        <div className="service-rows">
          {content.solution.services.map((service, index) => (
            <motion.div
              key={service}
              className="service-row"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 34 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: cinematicEase }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{service}</p>
              {content.isRtl ? (
                <ArrowLeft aria-hidden="true" size={22} />
              ) : (
                <ArrowRight aria-hidden="true" size={22} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesBreakdown({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-off-white px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl border-t border-black/15 pt-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {content.serviceBreakdown.map((service, index) => (
            <motion.article
              key={service.title}
              className="service-panel"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 34, scale: 0.98 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: cinematicEase }}
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
            >
              <div className="service-panel-visual" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul>
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="process"
      className="overflow-hidden bg-brand-black px-5 py-20 text-brand-white sm:px-8 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-24">
          <h2 className="max-w-xl text-balance text-4xl font-semibold leading-none tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {content.process.headline}
          </h2>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-white/70">
            {content.process.description}
          </p>
        </Reveal>

        <div className="process-stack">
          {content.process.steps.map((step, index) => (
            <motion.article
              key={step}
              className="process-step"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 64, scale: 0.985 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.72, delay: index * 0.09, ease: cinematicEase }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyScaleShift({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-off-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading title={content.why.headline} />
        </Reveal>
        <div className="why-list">
          {content.why.reasons.map((reason, index) => (
            <motion.div
              key={reason}
              className="why-item"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 34 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.58, delay: index * 0.06, ease: cinematicEase }}
            >
              <span />
              <p>{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offer({ content }: { content: SiteContent }) {
  return (
    <section className="bg-brand-black px-5 py-20 text-brand-white sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <Reveal>
          <h2 className="max-w-3xl text-balance text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            {content.offer.headline}
          </h2>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/70">
            {content.offer.description}
          </p>
        </Reveal>
        <Reveal className="offer-box" delay={0.1}>
          <ul>
            {content.offer.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <ButtonLink href="#contact" rtl={content.isRtl}>
            {content.offer.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="contact" className="bg-brand-red px-5 py-20 text-brand-white sm:px-8 lg:py-28">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, filter: "blur(18px)" }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.82, ease: cinematicEase }}
      >
        <motion.h2
          className="text-balance text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl lg:text-8xl"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.72, delay: 0.08, ease: cinematicEase }}
        >
          {content.finalCta.headline}
        </motion.h2>
        <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/85">
          {content.finalCta.description}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink href="#contact" variant="black" rtl={content.isRtl}>
            {content.finalCta.cta}
          </ButtonLink>
          <p className="text-sm font-medium text-white/80">
            {content.finalCta.note}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="bg-brand-black px-5 py-10 text-brand-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Image
          src="/brand/scaleshift-logo-red-white-transparent.png"
          alt="Scaleshift"
          width={322}
          height={90}
          loading="eager"
          className="h-auto w-40"
        />
        <nav aria-label={content.footerNavLabel} className="flex flex-wrap gap-5 text-sm text-white/70">
          <a href="#proof" className="transition hover:text-brand-white">
            {content.footer.social}
          </a>
          <a href="#contact" className="transition hover:text-brand-white">
            {content.footer.contact}
          </a>
          <a href="#contact" className="transition hover:text-brand-white">
            {content.footer.privacy}
          </a>
        </nav>
        <p className="text-sm text-white/50">{content.footer.copyright}</p>
      </div>
    </footer>
  );
}

export function HomePage({ content = englishContent }: { content?: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const reelY = useTransform(scrollYProgress, [0, 0.22], [0, -82]);
  const reelRotate = useTransform(scrollYProgress, [0, 0.22], [0, -3]);
  const reelScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.96]);
  const timelineX = useTransform(scrollYProgress, [0, 0.18], [0, -42]);

  return (
    <main
      lang={content.locale}
      dir={content.dir}
      className="site-shell min-h-screen overflow-hidden bg-background text-foreground"
    >
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <section className="hero-stage min-h-screen px-5 py-6 text-brand-white sm:px-8">
        <motion.div
          className="cinema-wipe"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { x: "-120%", opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { x: "120%", opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.45, delay: 0.18, ease: cinematicEase }}
        />

        <motion.header
          className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-5"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: cinematicEase }}
        >
          <motion.a
            href={content.homeHref}
            aria-label={content.logoLabel}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.035 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          >
            <Image
              src="/brand/scaleshift-logo-red-white-transparent.png"
              alt="Scaleshift"
              width={322}
              height={90}
              priority
              loading="eager"
              className="h-auto w-40 sm:w-48"
            />
          </motion.a>
          <motion.nav
            aria-label={content.navLabel}
            className="hidden items-center gap-8 text-sm font-medium text-white/80 lg:flex"
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.24 } },
            }}
          >
            <motion.a
              href="#work"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.work}
            </motion.a>
            <motion.a
              href="#services"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.services}
            </motion.a>
            <motion.a
              href="#process"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.process}
            </motion.a>
            <motion.a
              href="#proof"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.results}
            </motion.a>
            <motion.a
              href="#contact"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.contact}
            </motion.a>
          </motion.nav>
          <motion.div
            className="flex items-center gap-3"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 22 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: cinematicEase }}
          >
            <a href={content.alternateHref} className="language-link">
              {content.alternateLabel}
            </a>
            <div className="hidden sm:block">
              <ButtonLink href="#contact" rtl={content.isRtl}>
                {content.hero.primaryCta}
              </ButtonLink>
            </div>
          </motion.div>
        </motion.header>

        <motion.div
          className="relative z-10 mx-auto grid max-w-7xl gap-8 pb-12 pt-12 lg:grid-cols-[1.08fr_0.74fr_0.65fr] lg:items-center lg:gap-12 lg:pt-16"
          variants={heroContainer}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? undefined : "visible"}
        >
          <motion.div className="relative z-10" variants={heroItem}>
            <motion.p className="hero-label" variants={heroItem}>
              {content.hero.label}
            </motion.p>
            <motion.h1
              className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]"
              variants={heroItem}
            >
              {content.hero.headline}{" "}
              <span className="text-brand-red">{content.hero.highlight}</span>
            </motion.h1>
            <motion.p
              className="mt-7 max-w-xl text-pretty text-base leading-8 text-white/70 sm:text-lg"
              variants={heroItem}
            >
              {content.hero.subheadline}
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center"
              variants={heroItem}
            >
              <ButtonLink href="#contact" rtl={content.isRtl}>
                {content.hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#process" variant="text" rtl={content.isRtl}>
                {content.hero.secondaryCta}
              </ButtonLink>
            </motion.div>
          </motion.div>

          <ReelPreview
            content={content}
            y={reelY}
            rotate={reelRotate}
            scale={reelScale}
          />

          <motion.div className="built-list" variants={heroItem}>
            <p>{content.hero.builtLabel}</p>
            {content.hero.builtItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </motion.div>
        </motion.div>

        <TimelineStrip x={timelineX} />

        <motion.div
          className="proof-ticker"
          aria-label={content.hero.proofLabel}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.15, ease: cinematicEase }}
        >
          <div>
            {[...content.proof.stats, ...content.proof.stats].map((stat, index) => (
              <span key={`${stat}-${index}`}>{stat}</span>
            ))}
          </div>
        </motion.div>
      </section>

      <PortfolioShowcase content={content} />
      <SocialProof content={content} />
      <PainPoints content={content} />
      <Solution content={content} />
      <ServicesBreakdown content={content} />
      <Process content={content} />
      <WhyScaleShift content={content} />
      <Offer content={content} />
      <FinalCta content={content} />
      <Footer content={content} />
    </main>
  );
}

export default function Home() {
  return <HomePage content={englishContent} />;
}
