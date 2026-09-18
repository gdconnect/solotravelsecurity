import type { Metadata } from "next";
import { PageShell } from "@/components/templates/PageShell";
import { ManifestoSection } from "@/components/organisms/ManifestoSection";

export const metadata: Metadata = {
  title: "About | Solo Travel Security",
  description:
    "Why Solo Travel Security exists: a field-tested playbook for moving through unfamiliar places with awareness, planning, and calm.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <ManifestoSection />
    </PageShell>
  );
}
