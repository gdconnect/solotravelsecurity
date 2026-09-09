import type { MetadataRoute } from "next";
import { sitemap } from "@/lib/schema";

export default function sitemapRoute(): MetadataRoute.Sitemap {
  return sitemap();
}
