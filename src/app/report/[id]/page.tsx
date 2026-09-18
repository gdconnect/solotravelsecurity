import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";
import { PageShell } from "@/components/templates/PageShell";
import { Badge } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { ReportPrintButton } from "./ReportPrintButton";
import { ReportClientDashboard } from "./ReportClientDashboard";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return TOP_SOLO_DESTINATIONS.map((d) => ({
    id: d.slug,
  }));
}

export default async function ReportDashboardPage({ params }: ReportPageProps) {
  const { id } = await params;
  const dest = getDestinationBySlug(id);

  if (!dest) {
    notFound();
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Navigation & Action Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="amber">
                <Icon name="shield" className="size-3" />
                Personalised Security Dossier
              </Badge>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                Computed in Your Browser
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-black text-slate-900 sm:text-4xl dark:text-amber-50">
              Solo Travel Operational Playbook: {dest.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ReportPrintButton />
            <Link
              href={`/playbook/solo-female/${dest.slug}/night-arrival-transit/`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 font-display text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Icon name="refreshCw" className="size-3.5" />
              Adjust Profile
            </Link>
          </div>
        </div>

        {/* Suspense wrapper around client query params */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-12 font-mono text-xs text-slate-600 dark:text-slate-400">
              <Icon
                name="loader"
                className="mr-2 size-4 animate-spin text-amber-700 dark:text-amber-400"
              />
              Calibrating operational parameters...
            </div>
          }
        >
          <ReportClientDashboard destination={dest} />
        </Suspense>
      </div>
    </PageShell>
  );
}
