import type { Metadata } from "next";
import { PageShell } from "@/components/templates/PageShell";
import { Hero } from "@/components/organisms/Hero";
import { ManifestoSection } from "@/components/organisms/ManifestoSection";
import { NotifyBanner } from "@/components/organisms/NotifyBanner";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <ManifestoSection />
      <NotifyBanner />
    </PageShell>
  );
}
