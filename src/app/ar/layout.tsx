import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScaleShift | مونتاج ريلز يخلي محتواك يجيب عملاء",
  description:
    "ScaleShift تساعد صناع المحتوى والبراندات على تحويل الأفكار والمقاطع إلى ريلز احترافية بإيقاع سريع ورسالة واضحة تساعد على النمو والتحويل.",
};

export default function ArabicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
