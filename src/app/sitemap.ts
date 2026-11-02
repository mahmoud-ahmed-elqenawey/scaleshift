import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { en: "https://scaleshift.uk", ar: "https://scaleshift.uk/ar" };
  return [
    { url: languages.en, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: languages.ar, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
  ];
}
