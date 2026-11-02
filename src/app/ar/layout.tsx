import type { Metadata } from "next";

const title = "ScaleShift | مونتاج ريلز يخلي محتواك يجيب عملاء";
const description =
  "ScaleShift تساعد صناع المحتوى والبراندات على تحويل الأفكار والمقاطع إلى ريلز احترافية بإيقاع سريع ورسالة واضحة تساعد على النمو والتحويل.";
// Overriding openGraph drops the root's generated image, so point back at it.
const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ScaleShift" }];

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/ar",
    languages: { en: "/", ar: "/ar" },
  },
  openGraph: {
    type: "website",
    url: "/ar",
    siteName: "ScaleShift",
    title,
    description,
    locale: "ar_EG",
    images,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images,
  },
};

export default function ArabicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
