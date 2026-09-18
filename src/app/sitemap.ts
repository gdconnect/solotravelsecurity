import type { MetadataRoute } from "next";
import { sitemap } from "@/lib/schema";

export const dynamic = "force-static";

export default function sitemapRoute(): MetadataRoute.Sitemap {
  return sitemap();
}
