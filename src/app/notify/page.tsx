import type { Metadata } from "next";
import { PageShell } from "@/components/templates/PageShell";
import { NotifyBanner } from "@/components/organisms/NotifyBanner";

export const metadata: Metadata = {
  title: "Get Notified | Solo Travel Security",
  description:
    "One quiet email when the full playbook launches. No drip campaigns, no resold lists.",
  alternates: { canonical: "/notify/" },
};

export default function NotifyPage() {
  return (
    <PageShell>
      <NotifyBanner />
    </PageShell>
  );
}
