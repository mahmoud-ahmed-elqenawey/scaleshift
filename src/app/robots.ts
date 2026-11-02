import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/header-concept", "/api/"] },
    sitemap: "https://scaleshift.uk/sitemap.xml",
  };
}
