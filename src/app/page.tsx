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
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

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

const heroReels = [
  {
    label: "V-Left",
    className: "attention-phone-left",
    src: "https://drive.google.com/file/d/1h_jrsT1YtwS0q4Ch8gTMRZUsKdSynjZs/preview",
  },
  {
    label: "V-Middle",
    className: "attention-phone-center",
    src: "https://drive.google.com/file/d/1HbVVhcd8FuRx8f7W6RAHhr913cSxpJgR/preview",
  },
  {
    label: "V-Right",
    className: "attention-phone-right",
    src: "https://drive.google.com/file/d/1NrLmG087TAXtvWbGGsD7S8p8khr2zD4l/preview",
  },
];

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
    framework: "Framework",
    services: "Services",
    process: "Process",
    results: "Results",
    faq: "FAQ",
    contact: "Contact",
  },
  hero: {
    label: "Content that performs",
    systemPill: "RETENTION EDITING SYSTEM™",
    attentionLead: "Create",
    attentionAccent: "Attention",
    attentionSubline: "Not Just Edits.",
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
      "500M+ views generated",
      "600+ videos delivered",
      "60+ creators supported",
    ],
    testimonials: [
      "My content finally looks premium - and the numbers back it up.",
      "I stopped guessing what works. Everything now feels intentional.",
      "Fast, reliable, and the quality is on another level.",
    ],
  },
  trust: {
    label: "Trusted by",
    headline: "60+ creators generating millions of views every month.",
    channels: ["IG", "YT", "TT", "+60"],
  },
  comparison: {
    badge: "The Problem",
    headline: "Great editing isn't enough.",
    highlight: "Attention is.",
    groups: [
      {
        title: "Traditional Freelancers",
        tone: "muted",
        points: [
          "Edit videos, nothing more",
          "No strategy behind the cuts",
          "No retention thinking",
          "Inconsistent quality week to week",
          "Zero performance tracking",
        ],
      },
      {
        title: "Traditional Agencies",
        tone: "muted",
        points: [
          "Expensive retainers",
          "Slow turnaround",
          "Generic, templated editing",
          "No repeatable framework",
          "Focused on aesthetics, not attention",
        ],
      },
      {
        title: "ScaleShift",
        tone: "brand",
        points: [
          "Retention Editing System™",
          "Attention-first editing",
          "Watch-time optimization",
          "Story pacing built on viewer psychology",
          "Engineered for long-term growth",
        ],
      },
    ],
  },
  framework: {
    badge: "Our Framework",
    headline: "The Retention Editing",
    highlight: "System™",
    description:
      "Five stages. One repeatable system. Every second of every edit is engineered to keep a viewer watching.",
    steps: [
      {
        title: "Hook Engineering™",
        text: "Irresistible first seconds that stop the scroll before it starts.",
      },
      {
        title: "Attention Layering™",
        text: "Visual rhythm, motion, sound and text layered to hold focus.",
      },
      {
        title: "Retention Structure™",
        text: "Every cut designed to remove drop-off points before they happen.",
      },
      {
        title: "Watch Time Optimization™",
        text: "Pacing tuned to increase average view duration, not just polish.",
      },
      {
        title: "Growth Loop™",
        text: "Better retention earns more distribution, and the loop compounds.",
      },
    ],
  },
  creatorProfiles: {
    badge: "Trusted By",
    headline: "Creators We Helped Grow",
    description:
      "We partner with creators and brands across multiple niches to produce high-retention content that can scale consistently.",
    clientNames: [
      "Nasser Alaqeel",
      "James Masi",
      "Chris James",
      "Colin Pomeroy",
      "Monty Lans",
      "Sonia Zarbatany",
      "Anas Rawas",
      "Abdullah AlSanousi",
      "Qutaibah Alansari",
      "Moumen Talal",
    ],
    profiles: [
      {
        title: "Personal Brands",
        text: "Turn expertise into authority-building reels with a repeatable point of view.",
      },
      {
        title: "Coaches & Educators",
        text: "Make complex ideas simple, sharp, and easy to watch until the end.",
      },
      {
        title: "Service Creators",
        text: "Package proof, story, and offers into videos that move people to act.",
      },
      {
        title: "Growth-Stage Brands",
        text: "Build a consistent short-form engine without relying on random edits.",
      },
    ],
  },
  impact: {
    badge: "Numbers",
    headline: "Real Results. Real Growth.",
    description:
      "A topline snapshot of performance while the full case-study library is being prepared for publishing.",
    stats: [
      { value: 500, suffix: "M+", label: "Views Generated" },
      { value: 600, suffix: "+", label: "Videos Delivered" },
      { value: 96, suffix: "%", label: "Client Satisfaction" },
      { value: 60, suffix: "+", label: "Creators Supported" },
    ],
    results: [
      { value: "25.6M", label: "views", href: "https://www.instagram.com/fahedabusalah/reel/DLUz0dBTW1O/" },
      { value: "16M", label: "views", href: "https://www.instagram.com/the.ansari/reel/DNGn3pwMoiu/" },
      { value: "9.4M", label: "views", href: "https://www.instagram.com/the.ansari/reel/DQBqorPCB8w/" },
      { value: "5.4M", label: "views", href: "https://www.instagram.com/fahedabusalah/reel/DFDGsHayWYt/" },
    ],
  },
  clientFeedback: {
    badge: "Client Feedback",
    headline: "What changes when the system replaces random edits.",
    quotes: [
      "The Retention Editing System is a real framework, not a slogan. You feel the difference in every metric that matters.",
      "My content finally looks premium - and the numbers back it up.",
      "I stopped guessing what works. Everything now feels intentional.",
    ],
    voiceLabel: "Voice notes",
    voiceNote: "Approved client media previews will be added as soon as they are ready to publish.",
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
    note: "Instagram DM link coming soon",
  },
  faq: {
    badge: "FAQ",
    headline: "Everything you need to know.",
    items: [
      {
        question: "How does it work?",
        answer:
          "You start with a strategy call. From there we build your Retention Editing System™ around your content, deliver on a weekly cadence, and keep optimizing based on performance data.",
      },
      {
        question: "Who is it for?",
        answer:
          "Personal brands, coaches, business owners, and service creators who already have an audience or offer and want consistent growth instead of one-off edits.",
      },
      {
        question: "How many videos do I get?",
        answer:
          "Volume is scoped to your goals during the strategy call. Most clients run a weekly delivery cadence built around consistent short-form output.",
      },
      {
        question: "How quickly can we start?",
        answer:
          "Book a strategy call and, if it's a fit, we can typically kick off within the same week.",
      },
    ],
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
    framework: "النظام",
    services: "الخدمات",
    process: "الطريقة",
    results: "النتائج",
    faq: "الأسئلة",
    contact: "تواصل",
  },
  hero: {
    label: "مونتاج ريلز مبني على الأداء",
    systemPill: "RETENTION EDITING SYSTEM™",
    attentionLead: "Create",
    attentionAccent: "Attention",
    attentionSubline: "Not Just Edits.",
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
      "أكثر من 500 مليون مشاهدة",
      "أكثر من 600 فيديو تم تسليمه",
      "أكثر من 60 صانع محتوى",
    ],
    testimonials: [
      "أول مرة أحس إن محتواي شكله احترافي وبيخدم هدفي.",
      "بقينا نعرف ننشر إيه وليه، مش مجرد نجرب.",
      "الشغل سريع ومنظم، والنتيجة أعلى من توقعاتي.",
    ],
  },
  trust: {
    label: "يثق بنا",
    headline: "أكثر من 60 صانع محتوى بيحققوا ملايين المشاهدات شهريًا.",
    channels: ["IG", "YT", "TT", "+60"],
  },
  comparison: {
    badge: "المشكلة",
    headline: "المونتاج الحلو لوحده مش كفاية.",
    highlight: "الأهم هو الانتباه.",
    groups: [
      {
        title: "فريلانسر تقليدي",
        tone: "muted",
        points: [
          "يقص الفيديو وخلاص",
          "مفيش استراتيجية ورا كل Cut",
          "مفيش تفكير في الاحتفاظ بالمشاهد",
          "الجودة بتتغير من أسبوع للتاني",
          "مفيش متابعة حقيقية للأداء",
        ],
      },
      {
        title: "وكالة تقليدية",
        tone: "muted",
        points: [
          "تكلفة عالية من غير مرونة",
          "دورة تنفيذ بطيئة",
          "قوالب مكررة وشكل محفوظ",
          "مفيش نظام واضح قابل للتكرار",
          "تركيز على الشكل أكتر من الانتباه",
        ],
      },
      {
        title: "ScaleShift",
        tone: "brand",
        points: [
          "Retention Editing System™",
          "مونتاج مبني على جذب الانتباه",
          "تحسين مدة المشاهدة",
          "إيقاع وقصة مبنيين على سلوك المشاهد",
          "نظام يخدم النمو على المدى الطويل",
        ],
      },
    ],
  },
  framework: {
    badge: "نظام الشغل",
    headline: "The Retention Editing",
    highlight: "System™",
    description:
      "خمس مراحل واضحة. نظام متكرر يخلي كل ثانية في الفيديو معمولة عشان المشاهد يفضل مكمل.",
    steps: [
      {
        title: "Hook Engineering™",
        text: "أول ثواني معمولة عشان توقف التمرير وتفتح فضول المشاهد.",
      },
      {
        title: "Attention Layering™",
        text: "إيقاع بصري، حركة، صوت، ونصوص متظبطين مع بعض عشان الانتباه مايقعش.",
      },
      {
        title: "Retention Structure™",
        text: "كل Cut هدفه يشيل نقاط الملل قبل ما المشاهد يخرج.",
      },
      {
        title: "Watch Time Optimization™",
        text: "تظبيط السرعة والوقفات عشان مدة المشاهدة تزيد، مش عشان الفيديو يبقى شكله حلو بس.",
      },
      {
        title: "Growth Loop™",
        text: "احتفاظ أعلى يعني توزيع أقوى، ومع الوقت النمو بيتراكم.",
      },
    ],
  },
  creatorProfiles: {
    badge: "بنشتغل مع مين",
    headline: "صناع محتوى وبراندات عايزة تكبر بنظام",
    description:
      "نشتغل مع مجالات مختلفة ونحوّل المحتوى القصير من شغل عشوائي لنظام واضح قابل للتكرار.",
    clientNames: [
      "Nasser Alaqeel",
      "James Masi",
      "Chris James",
      "Colin Pomeroy",
      "Monty Lans",
      "Sonia Zarbatany",
      "Anas Rawas",
      "Abdullah AlSanousi",
      "Qutaibah Alansari",
      "Moumen Talal",
    ],
    profiles: [
      {
        title: "براندات شخصية",
        text: "نحوّل الخبرة لمحتوى يبني ثقة وسلطة في السوق.",
      },
      {
        title: "مدربين ومعلّمين",
        text: "نبسط الأفكار الصعبة ونطلعها في فيديو واضح وسهل يتشاف للآخر.",
      },
      {
        title: "مقدمي خدمات",
        text: "نرتب الدليل، القصة، والعرض في محتوى يدفع الناس تاخد خطوة.",
      },
      {
        title: "براندات في مرحلة نمو",
        text: "نبني ماكينة محتوى قصيرة المدى من غير اعتماد على مونتاج عشوائي.",
      },
    ],
  },
  impact: {
    badge: "الأرقام",
    headline: "نتائج حقيقية. نمو واضح.",
    description:
      "لمحة عامة عن الأداء لحد ما دراسات الحالة الكاملة تكون جاهزة للنشر.",
    stats: [
      { value: 500, suffix: "M+", label: "مشاهدة" },
      { value: 600, suffix: "+", label: "فيديو تم تسليمه" },
      { value: 96, suffix: "%", label: "رضا العملاء" },
      { value: 60, suffix: "+", label: "صانع محتوى" },
    ],
    results: [
      { value: "25.6M", label: "مشاهدة", href: "https://www.instagram.com/fahedabusalah/reel/DLUz0dBTW1O/" },
      { value: "16M", label: "مشاهدة", href: "https://www.instagram.com/the.ansari/reel/DNGn3pwMoiu/" },
      { value: "9.4M", label: "مشاهدة", href: "https://www.instagram.com/the.ansari/reel/DQBqorPCB8w/" },
      { value: "5.4M", label: "مشاهدة", href: "https://www.instagram.com/fahedabusalah/reel/DFDGsHayWYt/" },
    ],
  },
  clientFeedback: {
    badge: "رأي العملاء",
    headline: "لما النظام يحل محل المونتاج العشوائي.",
    quotes: [
      "النظام فرق فعلًا. الموضوع مش شعار، كل فيديو بقى معمول لهدف واضح.",
      "أول مرة أحس إن محتواي شكله احترافي وبيخدم هدفي.",
      "بقينا نعرف ننشر إيه وليه، مش مجرد نجرب.",
    ],
    voiceLabel: "Voice notes",
    voiceNote: "هنضيف معاينات ميديا العملاء بعد ما تكون جاهزة ومعتمدة للنشر.",
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
  faq: {
    badge: "أسئلة متكررة",
    headline: "كل اللي محتاج تعرفه قبل ما نبدأ.",
    items: [
      {
        question: "الشغل بيمشي إزاي؟",
        answer:
          "بنبدأ بمكالمة استراتيجية نفهم فيها المحتوى، الجمهور، والهدف. بعدها نبني نظام المونتاج المناسب لك ونشتغل بتسليم أسبوعي وتحسين مستمر حسب الأداء.",
      },
      {
        question: "الموقع ده مناسب لمين؟",
        answer:
          "مناسب للبراندات الشخصية، المدربين، أصحاب البيزنس، ومقدمي الخدمات اللي عندهم عرض واضح وعايزين نمو ثابت بدل فيديوهات منفصلة.",
      },
      {
        question: "هستلم كام فيديو؟",
        answer:
          "العدد بيتحدد حسب هدفك وحجم النشر المطلوب. في الأغلب بنبني خطة أسبوعية ثابتة تخلي الإنتاج مستمر وواضح.",
      },
      {
        question: "نقدر نبدأ إمتى؟",
        answer:
          "بعد مكالمة التعارف، لو في توافق واضح، نقدر نبدأ غالبًا في نفس الأسبوع.",
      },
    ],
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

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let frameId = 0;
    let start: number | null = null;
    const delayMs = delay * 1000;

    const tick = (timestamp: number) => {
      start ??= timestamp;
      const elapsed = timestamp - start;

      if (elapsed < delayMs) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((elapsed - delayMs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [delay, duration, shouldReduceMotion, value]);

  return (
    <>
      {prefix}
      {shouldReduceMotion ? value : current}
      {suffix}
    </>
  );
}

function AttentionHero({
  content,
  y,
  scale,
}: {
  content: SiteContent;
  y?: MotionValue<number>;
  scale?: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="attention-hero"
      variants={heroContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
    >
      <motion.div
        className="hero-system-pill attention-title-lock"
        variants={heroItem}
      >
        <span aria-hidden="true" />
        {content.hero.systemPill}
      </motion.div>

      <motion.div
        className="attention-phone-wrap"
        aria-hidden="true"
        dir="ltr"
        style={shouldReduceMotion ? undefined : { y, scale }}
        variants={heroItem}
      >
        <motion.div
          className="attention-stat attention-stat-left"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -24, scale: 0.95 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.72, delay: 0.9, ease: cinematicEase }}
        >
          <strong>
            <AnimatedCounter value={474} prefix="+" suffix="M" delay={0.95} />
          </strong>
          <span>Views</span>
        </motion.div>

        {heroReels.map((reel, index) => {
          const hover =
            index === 1
              ? { y: -16, scale: 1.025 }
              : { y: -12, rotate: index === 0 ? -7 : 8, scale: 1.02 };

          return (
            <motion.div
              key={reel.label}
              className={`attention-phone ${reel.className}`}
              data-drive-preview={reel.src}
              whileHover={shouldReduceMotion ? undefined : hover}
              transition={{ duration: 0.28, ease: cinematicEase }}
            >
              <div
                className={`attention-screen ${
                  index === 0 ? "scene-travel" : index === 1 ? "scene-founder" : "scene-system"
                }`}
              >
                <span className="phone-notch" />
                {index === 0 ? (
                  <>
                    <span className="travel-arch" />
                    <span className="travel-door" />
                    <span className="travel-person" />
                    <span className="travel-title">Portugal</span>
                  </>
                ) : null}
                {index === 1 ? (
                  <>
                    <span className="signal-ring signal-ring-one" />
                    <span className="signal-ring signal-ring-two" />
                    <span className="speaker-face" />
                    <span className="speaker-body" />
                    <span className="speaker-hand speaker-hand-left" />
                    <span className="speaker-hand speaker-hand-right" />
                    <span className="reel-arabic-word">الحل</span>
                  </>
                ) : null}
                {index === 2 ? (
                  <>
                    <span className="system-grid" />
                    <span className="system-path" />
                    <span className="system-figure" />
                    <span className="system-tile system-tile-one">F1</span>
                    <span className="system-tile system-tile-two">F2</span>
                    <span className="system-tile system-tile-three">F4</span>
                  </>
                ) : null}
                <span className="phone-progress" />
                {index === 1 ? (
                  <span className="reel-play-mini">
                    <Play size={22} fill="currentColor" strokeWidth={1.5} />
                  </span>
                ) : null}
              </div>
            </motion.div>
          );
        })}

        <motion.div
          className="attention-stat attention-stat-right"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24, scale: 0.95 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.72, delay: 1, ease: cinematicEase }}
        >
          <span>Watch time</span>
          <strong>
            <AnimatedCounter value={80} suffix="%" delay={1.05} />
          </strong>
          <span className="watch-chart">
            <svg viewBox="0 0 180 76" focusable="false">
              <path
                className="watch-chart-area"
                d="M8 66 C27 62 36 58 51 57 C69 56 75 48 91 45 C111 41 116 30 135 27 C154 24 162 16 174 11 L174 76 L8 76 Z"
              />
              <path
                className="watch-chart-base"
                d="M8 66 C27 62 36 58 51 57 C69 56 75 48 91 45 C111 41 116 30 135 27 C154 24 162 16 174 11"
              />
              <path
                className="watch-chart-line"
                pathLength="1"
                d="M8 66 C27 62 36 58 51 57 C69 56 75 48 91 45 C111 41 116 30 135 27 C154 24 162 16 174 11"
              />
              <circle className="watch-chart-dot" cx="174" cy="11" r="5" />
            </svg>
          </span>
        </motion.div>
      </motion.div>

      <motion.div className="attention-copy" variants={heroItem}>
        <motion.h1
          className="attention-headline attention-title-lock"
          variants={heroItem}
        >
          <span>{content.hero.attentionLead}</span>{" "}
          <em>{content.hero.attentionAccent}</em>
        </motion.h1>
        <motion.div
          className="attention-subline attention-title-lock"
          variants={heroItem}
        >
          <span />
          <p>{content.hero.attentionSubline}</p>
          <span />
        </motion.div>
        <motion.p className="attention-support" variants={heroItem}>
          {content.hero.subheadline}
        </motion.p>
        <motion.div
          className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row"
          variants={heroItem}
        >
          <ButtonLink href="#contact" rtl={content.isRtl}>
            {content.hero.primaryCta}
          </ButtonLink>
          <ButtonLink href="#work" variant="text" rtl={content.isRtl}>
            {content.nav.work}
          </ButtonLink>
        </motion.div>
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

function CreatorTrust({ content }: { content: SiteContent }) {
  return (
    <section className="creator-trust bg-brand-black px-5 py-12 text-brand-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 border-y border-white/10 py-10 md:grid-cols-[0.75fr_1fr] md:items-center">
        <Reveal>
          <p className="section-kicker">{content.trust.label}</p>
          <h2>{content.trust.headline}</h2>
        </Reveal>
        <Reveal className="trust-channel-row" delay={0.08}>
          {content.trust.channels.map((channel, index) => (
            <span
              key={channel}
              style={{ "--trust-index": index } as CSSProperties}
            >
              {channel}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
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

function ProblemComparison({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="results" className="comparison-section bg-brand-black px-5 py-20 text-brand-white sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="comparison-heading">
            <p className="section-kicker">{content.comparison.badge}</p>
            <h2>
              {content.comparison.headline}{" "}
              <span>{content.comparison.highlight}</span>
            </h2>
          </div>
        </Reveal>

        <div className="comparison-grid">
          {content.comparison.groups.map((group, index) => (
            <motion.article
              key={group.title}
              className={`comparison-card ${group.tone === "brand" ? "comparison-card-brand" : ""}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 38, scale: 0.98 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: cinematicEase }}
              whileHover={shouldReduceMotion ? undefined : { y: -8 }}
            >
              <h3>{group.title}</h3>
              <ul>
                {group.points.map((point) => (
                  <li key={point}>
                    <span aria-hidden="true">{group.tone === "brand" ? "✓" : "×"}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FrameworkSystem({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="framework" className="framework-system bg-brand-off-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <Reveal className="framework-copy lg:sticky lg:top-24">
          <p className="section-kicker">{content.framework.badge}</p>
          <h2>
            {content.framework.headline} <span>{content.framework.highlight}</span>
          </h2>
          <p>{content.framework.description}</p>
        </Reveal>

        <div className="framework-steps">
          {content.framework.steps.map((step, index) => (
            <motion.article
              key={step.title}
              className="framework-step"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 44 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.68, delay: index * 0.08, ease: cinematicEase }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CreatorProfiles({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="creator-profiles bg-brand-off-white px-5 pb-20 sm:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl border-t border-black/15 pt-16">
        <Reveal>
          <SectionHeading
            title={content.creatorProfiles.headline}
          >
            {content.creatorProfiles.description}
          </SectionHeading>
        </Reveal>

        <div className="creator-profile-grid">
          {content.creatorProfiles.profiles.map((profile, index) => (
            <motion.article
              key={profile.title}
              className="creator-profile-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.68, delay: index * 0.07, ease: cinematicEase }}
            >
              <span>{content.creatorProfiles.badge}</span>
              <h3>{profile.title}</h3>
              <p>{profile.text}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="client-name-strip"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.68, delay: 0.18, ease: cinematicEase }}
        >
          {content.creatorProfiles.clientNames.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ImpactNumbers({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="proof" className="impact-numbers bg-brand-black px-5 py-20 text-brand-white sm:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="impact-heading">
            <p className="section-kicker">{content.impact.badge}</p>
            <h2>{content.impact.headline}</h2>
            <p>{content.impact.description}</p>
          </div>
        </Reveal>

        <div className="impact-grid">
          {content.impact.stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              className="impact-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 36, scale: 0.98 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: cinematicEase }}
            >
              <h3>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  delay={0.1 + index * 0.08}
                  duration={1300}
                />
              </h3>
              <p>{stat.label}</p>
            </motion.article>
          ))}
        </div>

        <div className="result-proof-grid">
          {content.impact.results.map((result, index) => (
            <motion.a
              key={result.href}
              className="result-proof-card"
              href={result.href}
              target="_blank"
              rel="noreferrer"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.64, delay: index * 0.06, ease: cinematicEase }}
            >
              <strong>{result.value}</strong>
              <span>{result.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientFeedback({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();
  const bars = [30, 55, 80, 45, 65, 35, 90, 50, 70, 40, 60, 85, 32, 58, 46, 75, 36, 65];

  return (
    <section className="client-feedback-section bg-brand-black px-5 pb-20 text-brand-white sm:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-white/10 pt-16 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <Reveal>
          <p className="section-kicker">{content.clientFeedback.badge}</p>
          <h2>{content.clientFeedback.headline}</h2>
        </Reveal>

        <div className="feedback-grid">
          {content.clientFeedback.quotes.map((quote, index) => (
            <motion.figure
              key={quote}
              className="feedback-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.66, delay: index * 0.07, ease: cinematicEase }}
            >
              <blockquote>&quot;{quote}&quot;</blockquote>
            </motion.figure>
          ))}
          <motion.article
            className="voice-note-card"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.66, delay: 0.18, ease: cinematicEase }}
          >
            <div>
              <span>{content.clientFeedback.voiceLabel}</span>
              <p>{content.clientFeedback.voiceNote}</p>
            </div>
            <div className="voice-wave" aria-hidden="true">
              {bars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  style={{ "--bar-height": `${height}%`, "--bar-index": index } as CSSProperties}
                />
              ))}
            </div>
          </motion.article>
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

function FaqSection({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="faq" className="faq-section bg-brand-off-white px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <Reveal className="faq-heading lg:sticky lg:top-24">
          <p className="section-kicker">{content.faq.badge}</p>
          <h2>{content.faq.headline}</h2>
        </Reveal>

        <div className="faq-list">
          {content.faq.items.map((item, index) => (
            <motion.article
              key={item.question}
              className="faq-item"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.62, delay: index * 0.06, ease: cinematicEase }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="bg-brand-black px-5 py-10 text-brand-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Image
          src="/brand/scaleshift-logo-new.svg"
          alt="Scaleshift"
          width={3871}
          height={712}
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
  const phoneY = useTransform(scrollYProgress, [0, 0.22], [0, -68]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.97]);
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
              src="/brand/scaleshift-logo-new.svg"
              alt="Scaleshift"
              width={3871}
              height={712}
              priority
              loading="eager"
              className="h-auto w-32 sm:w-48"
            />
          </motion.a>
          <motion.nav
            aria-label={content.navLabel}
            className="hidden items-center gap-5 text-sm font-medium text-white/80 xl:gap-8 lg:flex"
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
              href="#framework"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.framework}
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
              href="#faq"
              className="nav-link"
              variants={heroItem}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              {content.nav.faq}
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
          <a href={content.alternateHref} className="mobile-language-link">
            {content.alternateLabel}
          </a>
        </motion.header>

        <AttentionHero
          content={content}
          y={phoneY}
          scale={phoneScale}
        />

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

      <CreatorTrust content={content} />
      <ProblemComparison content={content} />
      <FrameworkSystem content={content} />
      <CreatorProfiles content={content} />
      <ImpactNumbers content={content} />
      <ClientFeedback content={content} />
      <Solution content={content} />
      <ServicesBreakdown content={content} />
      <Process content={content} />
      <PortfolioShowcase content={content} />
      <WhyScaleShift content={content} />
      <Offer content={content} />
      <FaqSection content={content} />
      <FinalCta content={content} />
      <Footer content={content} />
    </main>
  );
}

export default function Home() {
  return <HomePage content={englishContent} />;
}
