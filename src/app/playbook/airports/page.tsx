import type { Metadata } from "next";
import Link from "next/link";
import { PREPOPULATED_AIRPORTS } from "@/data/lego/airports";
import { PageShell } from "@/components/templates/PageShell";
import { Reveal, Badge } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";

export const metadata: Metadata = {
  title: "Airport Ingress & Late-Night Arrival Directory | Solo Travel Security",
  description:
    "Explore airport transit security hubs, train curfew schedules, official taxi stand coordinates, and rogue tout truth tables for solo arrivals.",
};

export default function AirportsDirectoryPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <Breadcrumbs
          items={[{ label: "Playbook", href: "/playbook/" }, { label: "Airport Ingress Hubs" }]}
          className="mb-6"
        />

        <Reveal>
          <div className="flex items-center gap-2">
            <Badge tone="amber">
              <Icon name="compass" className="size-3" />
              Ingress & Transit Nodes
            </Badge>
          </div>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            Airport Security Hubs &
            <span className="block text-amber-600 dark:text-amber-300">
              Late-Night Arrival Gates.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            Airports are the peak vulnerability gate for solo travelers. Access deterministic
            decision tables, express train curfews, official taxi dispatch locations, and anti-tout
            truth tables.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PREPOPULATED_AIRPORTS.map((airport) => (
            <Link
              key={airport.iata}
              href={`/playbook/airports/${airport.iata.toLowerCase()}/`}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-amber-100 px-3 py-1 font-mono text-sm font-black text-amber-950 dark:bg-amber-950/60 dark:text-amber-200">
                    {airport.iata}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                    {airport.countryCode}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-xl font-black text-slate-900 group-hover:text-amber-600 dark:text-amber-50 dark:group-hover:text-amber-300">
                  {airport.name}
                </h2>
                <p className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                  📍 {airport.city}, {airport.country}
                </p>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Train Curfew:</span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {airport.lateNightCurfew.expressRailLastDeparture}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Official Taxi:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {airport.officialTaxi.flatRateCityCenterEur
                        ? `€${airport.officialTaxi.flatRateCityCenterEur} Flat`
                        : airport.officialTaxi.fareStructure}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Rogue Touts:</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                      {airport.scamToutWarning.activeInTerminal ? "Active in Hall" : "Low Risk"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 font-display text-xs font-bold text-amber-600 dark:border-slate-800">
                <span>View Ingress Playbook</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
