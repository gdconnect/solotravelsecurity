import type { Metadata } from "next";
import Link from "next/link";
import { TOP_SOLO_DESTINATIONS } from "@/data/destinations";
import { PageShell } from "@/components/templates/PageShell";
import { Reveal, Badge } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";

export const metadata: Metadata = {
  title: "Destination Security Dossiers | Solo Travel Security",
  description:
    "City-level security dossiers for solo travelers: arrival airports, safe and caution neighborhoods, top scams, emergency numbers, and local safety phrases.",
  alternates: { canonical: "/playbook/destinations/" },
};

export default function DestinationsDirectoryPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <Breadcrumbs
          items={[{ label: "Playbook", href: "/playbook/" }, { label: "Destinations" }]}
          className="mb-6"
        />

        <Reveal>
          <Badge tone="amber">
            <Icon name="compass" className="size-3" />
            City Dossiers
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            Destination Security
            <span className="block text-amber-600 dark:text-amber-300">Dossiers.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            One dossier per city: arrival airports, neighborhoods to favor and avoid, documented
            scams, emergency numbers, and the handful of local phrases that matter.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_SOLO_DESTINATIONS.map((dest) => (
            <Link
              key={dest.slug}
              href={`/playbook/destinations/${dest.slug}/`}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                    {dest.country}
                  </span>
                  <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    {dest.riskTier}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-black text-slate-900 group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                  {dest.name}
                </h2>
                <p className="mt-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                  Airports: {dest.arrivalAirports.map((a) => a.code).join(" · ")}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-400">
                  {dest.topScams.length} scams documented · {dest.safetyPhrases.length} phrases
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 font-display text-sm font-bold text-amber-700 dark:text-amber-400">
                Open dossier
                <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
