"use client";

import Image from "next/image";
import { ViewportVideo } from "@/components/viewport-video";
import { ReelDialog } from "@/components/reel-dialog";
import { IntroVideo } from "@/components/intro-video";
import { ClientStories } from "@/components/client-stories";
import { FaqAccordion } from "@/components/faq-accordion";
import { resultScreenshots } from "@/lib/result-screenshots";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, Play, X } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const cinematicEase: [number, number, number, number] = [0.16, 1, 0.3, 1];
const r2PublicBase = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev";
const frameworkVideos = {
  attention: `${r2PublicBase}/Editing%20System/001-Hook%20Attention.mp4`,
  retention: `${r2PublicBase}/Editing%20System/002-Retention%20Structure.mp4`,
  watchTime: `${r2PublicBase}/Editing%20System/003-Watch%20time.mp4`,
};
const r2ClientGroupImage = (fileName: string) =>
  `${r2PublicBase}/clients-group/${encodeURIComponent(fileName)}`;

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

const heroOrbitReels = [
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

const creatorCards = [
  {
    name: "Nasser Alaqeel",
    username: "naser_alaqeel",
    followers: "@naser_alaqeel",
    niche: "Entrepreneur",
    verified: true,
    profileUrl: "https://www.instagram.com/naser_alaqeel/",
    avatar: r2ClientGroupImage("Nasser Alaqeel.png"),
  },
  {
    name: "James Masi",
    username: "via.masi",
    followers: "@via.masi",
    niche: "Fitness Coach",
    verified: true,
    profileUrl: "https://www.instagram.com/via.masi/",
    avatar: r2ClientGroupImage("James Masi.png"),
  },
  {
    name: "Chris James",
    username: "chrisjamesonline",
    followers: "@chrisjamesonline",
    niche: "SaaS Founder",
    verified: false,
    profileUrl: "https://www.instagram.com/chrisjamesonline/",
    avatar: r2ClientGroupImage("Chris James.png"),
  },
  {
    name: "SONIA ZARBATANY",
    username: "soniazarbatany",
    followers: "@soniazarbatany",
    niche: "Personal Brand",
    verified: true,
    profileUrl: "https://www.instagram.com/soniazarbatany/",
    avatar: r2ClientGroupImage("SONIA ZARBATANY.png"),
  },
  {
    name: "Anas Rawas",
    username: "anas_rawas",
    followers: "@anas_rawas",
    niche: "Content Creator",
    verified: true,
    profileUrl: "https://www.instagram.com/anas_rawas/",
    avatar: r2ClientGroupImage("Anas Rawas.png"),
  },
  {
    name: "Abdullah AlSanousi",
    username: "sn3s",
    followers: "@sn3s",
    niche: "Fitness Coach",
    verified: false,
    profileUrl: "https://www.instagram.com/sn3s/",
    avatar: r2ClientGroupImage("Abdullah AlSanousi.png"),
  },
  {
    name: "Qutaibah B. Alansari",
    username: "the.ansari",
    followers: "@the.ansari",
    niche: "E-commerce",
    verified: true,
    profileUrl: "https://www.instagram.com/the.ansari/",
    avatar: r2ClientGroupImage("Qutaibah B. Alansari .png"),
  },
  {
    name: "Waleed Al Sleem",
    username: "waleedalsleem",
    followers: "@waleedalsleem",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/waleedalsleem/",
    avatar: r2ClientGroupImage("waleedalsleem.png"),
  },
  {
    name: "Fahed Abu Salah",
    username: "fahedabusalah",
    followers: "@fahedabusalah",
    niche: "Entrepreneur",
    verified: true,
    profileUrl: "https://www.instagram.com/fahedabusalah/",
    avatar: r2ClientGroupImage("Fahed Abu Salah.png"),
  },
  {
    name: "Saeed Alkhasouni",
    username: "mrsaeed.ae",
    followers: "@mrsaeed.ae",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/mrsaeed.ae/",
    avatar: r2ClientGroupImage("Saeed Alkhasouni.png"),
  },
  {
    name: "Naji Alhammadi",
    username: "naji__alhammadi",
    followers: "@naji__alhammadi",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/naji__alhammadi/",
    avatar: r2ClientGroupImage("Naji Alhammadi.png"),
  },
  {
    name: "Hasan Alattar",
    username: "alattarpix",
    followers: "@alattarpix",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/alattarpix/",
    avatar: r2ClientGroupImage("HASAN ALATTAR.png"),
  },
  {
    name: "M Bloushie",
    username: "m_bloushie",
    followers: "@m_bloushie",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/m_bloushie/",
    avatar: r2ClientGroupImage(" m_bloushie.png"),
  },
  {
    name: "Moumen Talal",
    username: "moumen612",
    followers: "@moumen612",
    niche: "SaaS Founder",
    verified: true,
    profileUrl: "https://www.instagram.com/moumen612/",
    avatar: r2ClientGroupImage("Moumen Talal.png"),
  },
  {
    name: "Abdullah Al Alawi",
    username: "abdullah_yw",
    followers: "@abdullah_yw",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/abdullah_yw/?hl=ar",
    avatar: r2ClientGroupImage("عبدالله العلاوي.png"),
  },
  {
    name: "Hazem Rasmy",
    username: "hazemrasmy",
    followers: "@hazemrasmy",
    niche: "Content Creator",
    verified: true,
    profileUrl: "https://www.instagram.com/hazemrasmy/",
    avatar: r2ClientGroupImage("Hazem Rasmy.png"),
  },
  {
    name: "ViralDose",
    username: "viraldose.ae",
    followers: "@viraldose.ae",
    niche: "Agency",
    verified: false,
    profileUrl: "https://www.instagram.com/viraldose.ae?igsh=ZGlvcHU4bzJ5dW5z",
    avatar: r2ClientGroupImage("ViralDose.png"),
  },
  {
    name: "Moujtaba Khalifa",
    username: "moujtabakhalifa",
    followers: "@moujtabakhalifa",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/moujtabakhalifa",
    avatar: r2ClientGroupImage("Moujtaba Khalifa.png"),
  },
  {
    name: "Abdulmajeed Al Mutawa",
    username: "mjeedalii",
    followers: "@mjeedalii",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/mjeedalii/",
    avatar: r2ClientGroupImage("عبدالمجيد المطيويع.png"),
  },
  {
    name: "Diet And Cheat",
    username: "dietand.cheat",
    followers: "@dietand.cheat",
    niche: "Creator",
    verified: false,
    profileUrl: "https://www.instagram.com/dietand.cheat/?hl=ar",
    avatar: r2ClientGroupImage("dietand.cheat.png"),
  },
];

const feedbackScreens = [
  "000000.png", "000002.png", "000003.png", "000004.png",
  "00002.png", "00005.png", "6778fgfh.png",
].map(file => `${r2PublicBase}/screen-feedback/${file}`);

const selectedWorkVideos = [
  "https://res.cloudinary.com/rzbfjedm/video/upload/v1786291247/V-Left_aos9au.mp4",
  "https://res.cloudinary.com/rzbfjedm/video/upload/v1787044153/Sequence_07_1_ughkyp.mp4",
  "https://res.cloudinary.com/rzbfjedm/video/upload/v1786976171/003_n5jph8.mp4",
  "https://res.cloudinary.com/rzbfjedm/video/upload/v1787082909/004_kvnomx.mp4",
  "https://res.cloudinary.com/rzbfjedm/video/upload/v1786291428/V-Right_dwxgbe.mp4",
  "https://res.cloudinary.com/rzbfjedm/video/upload/v1785674816/002_d3dnts.mp4",
];


const resultImages = [
  "https://res.cloudinary.com/rzbfjedm/image/upload/v1786994552/8R4GVEFASC_ke0vc8.png",
  "https://res.cloudinary.com/rzbfjedm/image/upload/v1786488584/54esdfgh_klrswa.png",
  "https://res.cloudinary.com/rzbfjedm/image/upload/v1786488583/3456ygf_seme72.png",
  "https://res.cloudinary.com/rzbfjedm/image/upload/v1786488581/0iuhbnkiuh_vttwd0.png",
  "https://res.cloudinary.com/rzbfjedm/image/upload/v1786488578/675drtxfcvbhijok_noxu04.png",
  "https://res.cloudinary.com/rzbfjedm/image/upload/v1786488576/0000000000000000_aaltva.png",
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
    attentionLead: "Create",
    attentionAccent: "Attention",
    attentionSubline: "Not Just Edits.",
    headline: "Turn Your Content Into a",
    highlight: "Revenue Machine",
    subheadline:
      "We helped 60+ clients generate +1B views through high-retention editing System™",
    primaryCta: "Build Retention Now",
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
  trust: {
    label: "Trusted by",
    headline: "60+ creators generating millions of views every month.",
    channels: ["IG", "YT", "TT", "+60"],
    avatars: [
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387718/general-profile-picture_4_1_utzhv0.png",
        alt: "Daniel Hart",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387746/general-profile-picture_3_yia62a.png",
        alt: "Marcus Reid",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387716/general-profile-picture_idzhcl.png",
        alt: "Brandon Lee",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387772/general-profile-picture_2_sqhplw.png",
        alt: "Sophie Turner",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387708/general-profile-picture_1_n66h3z.png",
        alt: "Ayaan Rahman",
      },
    ],
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
      "Three stages. One repeatable system. Every second of every edit is engineered to keep a viewer watching.",
    steps: [
      {
        title: "Attention Hook™",
        text: "Irresistible first seconds that stop the scroll before it starts.",
        video: frameworkVideos.attention,
      },
      {
        title: "Retention Structure™",
        text: "Every cut designed to remove drop-off points before they happen.",
        video: frameworkVideos.retention,
      },
      {
        title: "Watch Time Optimization™",
        text: "Pacing tuned to increase average view duration, not just polish.",
        video: frameworkVideos.watchTime,
      },
    ],
  },
  creatorProfiles: {
    badge: "Trusted By",
    headline: "Creators We Helped Grow",
    description:
      "We've partnered with creators and brands across multiple niches to produce high-retention content that reaches millions of viewers.",
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
    badge: "Case Studies",
    headline: "Performance in numbers.",
    description: "",
    stats: [
      { value: 1, suffix: "B+", label: "Views Generated" },
      { value: 600, suffix: "+", label: "Videos Delivered" },
      { value: 96, suffix: "%", label: "Happy client" },
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
    headline: "Testimonial",
    description: "Slide right to listen to client voice notes and real retention feedback.",
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
    badge: "How to Get Started",
    headline: "From call to Retention Editing System™",
    description: "",
    steps: [
      "Book Call",
      "Editing System",
      "Daily Delivery",
      "Consistency",
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
    headline: "Your content deserves more attention",
    description: "Stop buying editing. Start building attention",
    cta: "Build Retention now",
    note: "",
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
        question: "How long does onboarding take?",
        answer:
          "Most clients are fully onboarded and receiving their first batch within one to two weeks of the strategy call.",
      },
      {
        question: "Do I need scripts?",
        answer:
          "No. We work with raw footage and existing long-form content. Story architecture and pacing are handled entirely by our system.",
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
    description: "Retention Editing System™",
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
    attentionLead: "اخطف",
    attentionAccent: "الانتباه",
    attentionSubline: "مش مجرد مونتاج.",
    headline: "حوّل محتواك لأداة نمو",
    highlight: "تجيب عملاء",
    subheadline:
      "ساعدنا أكتر من 60 عميل يحققوا +1B مشاهدة من خلال High-Retention Editing System™",
    primaryCta: "ابني ريتينشن الآن",
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
  trust: {
    label: "يثق بنا",
    headline: "أكثر من 60 صانع محتوى بيحققوا ملايين المشاهدات شهريًا.",
    channels: ["IG", "YT", "TT", "+60"],
    avatars: [
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387718/general-profile-picture_4_1_utzhv0.png",
        alt: "Daniel Hart",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387746/general-profile-picture_3_yia62a.png",
        alt: "Marcus Reid",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387716/general-profile-picture_idzhcl.png",
        alt: "Brandon Lee",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387772/general-profile-picture_2_sqhplw.png",
        alt: "Sophie Turner",
      },
      {
        src: "https://res.cloudinary.com/rzbfjedm/image/upload/v1786387708/general-profile-picture_1_n66h3z.png",
        alt: "Ayaan Rahman",
      },
    ],
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
      "ثلاث مراحل واضحة. نظام متكرر يخلي كل ثانية في الفيديو معمولة عشان المشاهد يفضل مكمل.",
    steps: [
      {
        title: "Attention Hook™",
        text: "أول ثواني معمولة عشان توقف التمرير وتفتح فضول المشاهد.",
        video: frameworkVideos.attention,
      },
      {
        title: "Retention Structure™",
        text: "كل Cut هدفه يشيل نقاط الملل قبل ما المشاهد يخرج.",
        video: frameworkVideos.retention,
      },
      {
        title: "Watch Time Optimization™",
        text: "تظبيط السرعة والوقفات عشان مدة المشاهدة تزيد، مش عشان الفيديو يبقى شكله حلو بس.",
        video: frameworkVideos.watchTime,
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
    badge: "دراسات حالة",
    headline: "الأداء بالأرقام.",
    description: "",
    stats: [
      { value: 1, suffix: "B+", label: "مشاهدة" },
      { value: 600, suffix: "+", label: "فيديو تم تسليمه" },
      { value: 96, suffix: "%", label: "عملاء سعداء" },
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
    headline: "آراء العملاء",
    description: "اسحب يمين وشمال عشان تسمع فويسات العملاء وتشوف تعليقاتهم على النتائج.",
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
    badge: "إزاي نبدأ",
    headline: "من أول مكالمة لحد نظام مونتاج واضح",
    description: "",
    steps: [
      "مكالمة تعارف",
      "نظام مونتاج",
      "تسليم يومي",
      "استمرارية",
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
    headline: "محتواك يستاهل انتباه أكتر",
    description: "بلاش تدفع في مونتاج وخلاص. ابنِ انتباه حقيقي.",
    cta: "ابدأ بناء الريتينشن",
    note: "",
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
        question: "التجهيز بياخد قد إيه؟",
        answer:
          "في أغلب الحالات أول دفعة بتكون جاهزة خلال أسبوع لأسبوعين من بعد مكالمة الاستراتيجية وتجميع المواد.",
      },
      {
        question: "لازم أكون مجهز سكريبتات؟",
        answer:
          "مش لازم. نقدر نشتغل على لقطات خام أو محتوى طويل موجود، ونرتب القصة والإيقاع جوه نظام المونتاج.",
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
    description: "Retention Editing System™",
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
  active = true,
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  active?: boolean;
  decimals?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || !active) {
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
      const precision = 10 ** decimals;
      setCurrent(Math.round(value * eased * precision) / precision);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, decimals, delay, duration, shouldReduceMotion, value]);

  return (
    <>
      {prefix}
      {shouldReduceMotion ? value : decimals && current < value ? current.toFixed(decimals) : current}
      {suffix}
    </>
  );
}

function InstagramMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function HighlightSystemMark({ text }: { text: string }) {
  const parts = text.split(/(System™|\+1B|60\+|60)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part === "System™") {
          return (
            <span className="hero-system-mark" key={`${part}-${index}`}>
              {part}
            </span>
          );
        }

        if (part === "60+" || part === "60" || part === "+1B") {
          return (
            <strong className="hero-proof-strong" key={`${part}-${index}`}>
              {part}
            </strong>
          );
        }

        return part;
      })}
    </>
  );
}

function MetaVerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`meta-verified-badge ${className}`}
      viewBox="0 0 24 24"
      aria-label="Verified"
      role="img"
    >
      <path
        d="M12 1.55 14.26 3.58 17.29 3.32 18.54 6.09 21.23 7.51 20.48 10.45 21.52 13.3 19.02 15.04 18.06 17.93 15.03 18.01 12.62 19.86 10.09 18.15 7.06 18.24 5.93 15.42 3.33 13.85 4.21 10.94 3.03 8.14 5.44 6.27 6.27 3.34 9.31 3.47 12 1.55Z"
        fill="currentColor"
      />
      <path
        className="meta-verified-badge-check"
        d="m7.95 11.9 2.65 2.65 5.55-5.65"
        fill="none"
        stroke="white"
        strokeWidth="2.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
  const [orbitAngle, setOrbitAngle] = useState(18);
  const heroRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1024);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    let frame = 0;
    let visible = false;
    let previous = 0;
    let elapsed = 0;
    const animate = (now: number) => {
      if (previous) elapsed += now - previous;
      previous = now;
      setOrbitAngle(18 + (elapsed / 28000) * 360);
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (heroRef.current) observer.observe(heroRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [shouldReduceMotion]);

  const radiusX = viewportWidth < 640 ? 176 : viewportWidth < 900 ? 282 : 410;
  const radiusY = viewportWidth < 640 ? 218 : viewportWidth < 900 ? 300 : 360;

  return (
    <motion.div
      className="attention-hero"
      ref={heroRef}
      variants={heroContainer}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? undefined : "visible"}
    >
      <motion.div
        className="hero-reel-orbit-wrap"
        dir="ltr"
        style={shouldReduceMotion ? undefined : { y, scale }}
        variants={heroItem}
      >
        <div className="hero-reel-orbit" aria-hidden="true">
          {heroOrbitReels.map((reel, index) => (
            <HeroOrbitReel
              key={reel.src}
              reel={reel}
              index={index}
              count={heroOrbitReels.length}
              orbitAngle={orbitAngle}
              radiusX={radiusX}
              radiusY={radiusY}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="attention-copy"
        variants={heroItem}
      >
        <motion.h1
          className={`attention-headline ${content.isRtl ? "" : "attention-title-lock"}`}
          dir={content.isRtl ? "rtl" : "ltr"}
          variants={heroItem}
        >
          <span className={content.isRtl ? undefined : "attention-headline-lead"}>
            {content.hero.attentionLead}
          </span>{" "}
          <em>{content.hero.attentionAccent}</em>
        </motion.h1>
        <motion.div
          className={`attention-subline ${content.isRtl ? "" : "attention-title-lock"}`}
          dir={content.isRtl ? "rtl" : "ltr"}
          variants={heroItem}
        >
          <span />
          <p>{content.hero.attentionSubline}</p>
          <span />
        </motion.div>
        <motion.p className="attention-support" variants={heroItem}>
          <HighlightSystemMark text={content.hero.subheadline} />
        </motion.p>
        <motion.div
          className="hero-copy-actions"
          dir={content.isRtl ? "rtl" : "ltr"}
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

function HeroOrbitReel({
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
      className="hero-orbit-reel"
      data-r2-src={reel.src}
      style={
        {
          opacity: opacity.toFixed(6),
          pointerEvents: opacity > 0.2 ? "auto" : "none",
          zIndex: String(Math.round((centerWeight + reveal) * 20)),
          filter: `saturate(1.05) blur(${blur.toFixed(2)}px)`,
          transform: `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px) rotate(${orbitRotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
        } as CSSProperties
      }
    >
      <ViewportVideo
        src={reel.src}
        active={opacity > 0.05}
        aria-label={reel.label}
      />
    </div>
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
    <section className="creator-trust bg-brand-black px-5 py-10 text-brand-white sm:px-8">
      <div className="mx-auto max-w-7xl border-y border-white/10 py-10">
        <Reveal className="trust-proof-wrap">
          <div className="trust-avatar-row" aria-label={content.trust.label}>
            {content.trust.avatars.map((avatar, index) => (
              <div
                className="trust-avatar"
                key={avatar.src}
                style={{ "--trust-index": index } as CSSProperties}
              >
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  sizes="68px"
                  unoptimized
                />
              </div>
            ))}
            <div
              className="trust-avatar trust-avatar-more"
              style={{ "--trust-index": content.trust.avatars.length } as CSSProperties}
            >
              +60
            </div>
          </div>
          <p>
            {content.isRtl ? (
              <>
                موثوق من <strong>أكثر من 60 صانع محتوى</strong> بيحققوا ملايين
                المشاهدات شهريًا
              </>
            ) : (
              <>
                Trusted by <strong>60+ creators</strong> generating millions of
                views
              </>
            )}
          </p>
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
                    <span aria-hidden="true">
                      {group.tone === "brand" ? <Check size={14} /> : <X size={13} />}
                    </span>
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
              <ViewportVideo
                className="framework-step-video"
                src={step.video}
                aria-label={step.title}
              />
              <div>
                <h3>{step.title}</h3>
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

function ReferenceSectionHeading({
  badge,
  title,
  description,
  dark,
}: {
  badge?: string;
  title: ReactNode;
  description?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className={`reference-section-head ${dark ? "is-dark" : ""}`}>
      {badge ? <span className="reference-badge">{badge}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </Reveal>
  );
}

function ReferenceBand({
  id,
  tone,
  className = "",
  children,
}: {
  id?: string;
  tone: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`reference-band reference-band-${tone} ${className}`}>
      {children}
    </section>
  );
}

function ReferenceTrust({ content }: { content: SiteContent }) {
  const creatorTrack = [...creatorCards, ...creatorCards];

  return (
    <ReferenceBand id="work" tone="dark" className="reference-trust">
      <Reveal className="reference-wrap reference-trust-inner">
        <p className="reference-trust-label">
          <span>{content.isRtl ? "موثوق من" : "Trusted by"}</span>
          <MetaVerifiedBadge className="is-red" />
        </p>
      </Reveal>
      <Reveal className="reference-trust-slider">
        <div className="reference-trust-track">
          {creatorTrack.map((creator, index) => (
            <a
              className="reference-client-pill"
              href={creator.profileUrl}
              target="_blank"
              rel="noreferrer"
              key={`${creator.username}-${index}`}
            >
              <Image
                src={creator.avatar}
                alt={creator.name}
                width={48}
                height={48}
                loading={index < creatorCards.length ? "eager" : "lazy"}
                decoding="async"
                sizes="48px"
                unoptimized
                />
              <div className="reference-client-info">
                <h3>
                  <span>{creator.name}</span>
                  <MetaVerifiedBadge />
                </h3>
                <p>
                  <InstagramMark size={14} />
                  {creator.followers}
                </p>
              </div>
            </a>
          ))}
        </div>
      </Reveal>
    </ReferenceBand>
  );
}

function ReferenceComparison({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ReferenceBand id="results" tone="dark" className="reference-comparison">
      <div className="reference-wrap">
        <ReferenceSectionHeading
          title={content.isRtl ? "ليه ScaleShift؟" : "Why ScaleShift?"}
          dark
        />
        <div className="reference-compare-grid">
          {content.comparison.groups.map((group, index) => (
            <motion.article
              key={group.title}
              className={`reference-compare-card ${group.tone === "brand" ? "is-brand" : ""}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.32 }}
              transition={{ duration: 0.68, delay: index * 0.08, ease: cinematicEase }}
            >
              <h3>{group.title}</h3>
              <ul>
                {group.points.map((point) => (
                  <li key={point}>
                    <span aria-hidden="true">
                      {group.tone === "brand" ? <Check size={14} /> : <X size={13} />}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </ReferenceBand>
  );
}

function ReferenceFramework({ content }: { content: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();
  const [started, setStarted] = useState(false);

  return (
    <ReferenceBand id="framework" tone="light">
      <div className="reference-wrap">
        <ReferenceSectionHeading
          badge={content.framework.badge}
          title={
            <>
              The Retention
              <br />
              <span className="reference-nowrap">
                <span className="reference-title-ink">Editing</span> System™
              </span>
            </>
          }
        />
        <motion.div
          className={`reference-timeline${started ? " is-running" : ""}${shouldReduceMotion ? " is-reduced" : ""}`}
          onViewportEnter={() => setStarted(true)}
          onViewportLeave={() => setStarted(false)}
          viewport={{ amount: 0.08 }}
        >
          {content.framework.steps.map((step, index) => (
            <article
              key={step.title}
              className="reference-step"
              style={{ "--step-index": index } as CSSProperties}
            >
              <span className="reference-step-number">{String(index + 1).padStart(2, "0")}</span>
              {index < content.framework.steps.length - 1 && (
                <span className="reference-step-connector" aria-hidden="true">
                  <span className="reference-step-fill" />
                  <ArrowRight className="reference-step-arrow" size={16} />
                </span>
              )}
              <div className="reference-step-content">
              <ViewportVideo
                className="reference-step-video"
                src={step.video}
                aria-label={step.title}
              />
              <h3>{step.title}</h3>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </ReferenceBand>
  );
}

function ReferenceNumbers({ content }: { content: SiteContent }) {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const imageRows = [resultScreenshots];

  return (
    <motion.section
      id="impact"
      className={`impact-showcase${visible && !shouldReduceMotion ? " is-moving" : ""}`}
      onViewportEnter={() => { setStarted(true); setVisible(true); }}
      onViewportLeave={() => setVisible(false)}
      viewport={{ amount: 0.15 }}
      aria-label={content.impact.headline}
    >
      <div className="impact-image-wall" dir="ltr">
        {imageRows.map((row, rowIndex) => (
          <div className="impact-image-track" key={rowIndex}>
            {[0, 1].map(copy => (
              <div className="impact-image-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {row.map((reel) => (
                  <figure className="impact-reel" key={reel.image}
                    tabIndex={copy === 0 ? 0 : -1}
                    aria-label={`${reel.views} ${content.isRtl ? "مشاهدة" : "views"}`}>
                    <Image src={reel.image} alt={`${reel.views} ${content.isRtl ? "مشاهدة" : "views"}`} width={180} height={300} unoptimized loading="lazy" />
                    <span className="impact-reel-overlay" aria-hidden="true">
                      <span className="impact-reel-action" dir="ltr">{reel.views}</span>
                    </span>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div className="impact-image-track impact-watchtime-track">
          {[0, 1].map(copy => (
            <div className="impact-image-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {resultImages.map((image) => (
                <figure className="impact-reel impact-watchtime" key={image}>
                  <Image src={image} alt={content.isRtl ? "نتيجة الاحتفاظ بالمشاهدين" : "Audience retention chart"}
                    width={758} height={519} unoptimized loading="lazy" />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div id="proof" className="reference-wrap impact-content">
        <div className="reference-number-grid">
          {content.impact.stats.map((stat, index) => (
            <div className="reference-number" key={stat.label}>
              <h3 dir="ltr" aria-label={`${stat.value}${stat.suffix}`}>
                <span aria-hidden="true">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  delay={index * 0.08}
                  duration={1800}
                  active={started}
                  decimals={index === 0 ? 2 : 0}
                />
                </span>
              </h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ReferenceClientFeedback({ content }: { content: SiteContent }) {
  const stories = Array.from({ length: 12 }, (_, index) => ({
    name: content.isRtl ? "رأي عميل" : "Client feedback",
    video: `https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev/Client%20feedback/000${index + 1}.mp4`,
  }));
  return <ClientStories stories={stories} reviews={feedbackScreens} rtl={content.isRtl} />;
}

function ReferenceSelectedWork() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videos = [...selectedWorkVideos, ...selectedWorkVideos];

  return (
    <ReferenceBand tone="dark" className="reference-work-section">
      <div className="reference-wrap">
        <ReferenceSectionHeading
          badge="Projects"
          title="Selected Work"
          dark
        />
        <Reveal className="reference-filter-row">
          <span>Short-Form & Reels</span>
        </Reveal>
      </div>
      <Reveal className="reference-video-viewport">
        <div className="reference-video-track">
          {videos.map((video, index) => (
            <button
              className="reference-video-card"
              type="button"
              key={`${video}-${index}`}
              onClick={() => setActiveVideo(video)}
              aria-label="Open selected work video"
            >
              <ViewportVideo src={video} />
              <span>
                <Play size={18} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </Reveal>
      {activeVideo && <ReelDialog src={activeVideo} onClose={() => setActiveVideo(null)} />}
    </ReferenceBand>
  );
}

function ReferenceFaq({ content }: { content: SiteContent }) {
  return (
    <ReferenceBand id="faq" tone="dark" className="faq-section">
      <div className="reference-wrap">
        <ReferenceSectionHeading
          badge={content.faq.badge}
          title={content.isRtl ? content.faq.headline : "What Clients Ask Us"}
          dark
        />
        <Reveal>
          <FaqAccordion items={content.faq.items} />
        </Reveal>
      </div>
    </ReferenceBand>
  );
}

function ReferenceFinalCta({ content }: { content: SiteContent }) {
  return (
    <ReferenceBand id="contact" tone="light" className="reference-final-cta">
      <Reveal className="reference-wrap">
        <h2>
          {content.isRtl ? (
            content.finalCta.headline
          ) : (
            <>
              Your content deserves <span>more attention</span>
            </>
          )}
        </h2>
        <p>{content.finalCta.description}</p>
        <ButtonLink href="#contact" rtl={content.isRtl}>
          {content.finalCta.cta}
        </ButtonLink>
      </Reveal>
    </ReferenceBand>
  );
}

function ReferenceFooter({ content }: { content: SiteContent }) {
  return (
    <footer className="reference-footer">
      <div className="reference-wrap reference-footer-inner">
        <div className="footer-main">
        <div className="footer-brand">
        <a href={content.homeHref} aria-label={content.logoLabel}>
          <Image
          src="/brand/scaleshift-logo-new.svg"
          alt="Scaleshift"
          width={3871}
          height={712}
          className="reference-footer-logo"
          unoptimized
          />
        </a>
        <span className="footer-system" dir="ltr">Retention Editing <span>System™</span></span>
        </div>
        <div className="footer-connect">
          <h2>{content.isRtl ? "خلّينا نتكلم" : "Let’s talk"}</h2>
          <a className="footer-instagram" href="https://www.instagram.com/scaleshift/" target="_blank" rel="noopener noreferrer">
            <InstagramMark size={20} /><span>Instagram<small dir="ltr">@scaleshift</small></span><ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        </div>
        <div className="footer-bottom">
          <small>{content.footer.copyright}</small>
          <div className="footer-utilities">
            <a href={content.alternateHref} lang={content.isRtl ? "en" : "ar"}>{content.alternateLabel}</a>
            <a className="footer-top" href="#top" aria-label={content.isRtl ? "الرجوع لأعلى الصفحة" : "Back to top"} title={content.isRtl ? "الرجوع لأعلى الصفحة" : "Back to top"}><ArrowUp size={20} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

void [
  CreatorTrust,
  PortfolioShowcase,
  ProblemComparison,
  FrameworkSystem,
  CreatorProfiles,
  ImpactNumbers,
  ClientFeedback,
  Solution,
  ServicesBreakdown,
  Process,
  WhyScaleShift,
  Offer,
  FinalCta,
  FaqSection,
  Footer,
];

export function HomePage({ content = englishContent }: { content?: SiteContent }) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const phoneY = useTransform(scrollYProgress, [0, 0.22], [0, -68]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.97]);

  return (
    <main
      id="top"
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

      </section>

      <ReferenceTrust content={content} />
      <ReferenceComparison content={content} />
      <ReferenceFramework content={content} />
      <ReferenceNumbers content={content} />
      <ReferenceClientFeedback content={content} />
      <ReferenceSelectedWork />
      <ReferenceFaq content={content} />
      <ReferenceFinalCta content={content} />
      <ReferenceFooter content={content} />
      <IntroVideo isRtl={content.isRtl} />
    </main>
  );
}

export default function Home() {
  return <HomePage content={englishContent} />;
}
