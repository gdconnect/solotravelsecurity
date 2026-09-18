import Link from "next/link";
import type { ArrivalAirport, DestinationSecurityProfile } from "@/data/destinations";
import { PageShell } from "@/components/templates/PageShell";
import { Reveal, Badge } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";

interface SparseAirportPageProps {
  destination: DestinationSecurityProfile;
  airport: ArrivalAirport;
}

/**
 * Sparse airport page: rendered for arrival airports that have no full
 * ingress hub in src/data/lego/airports.ts yet. Content comes from the
 * destination dossier so every linked airport resolves to a real page.
 */
export function SparseAirportPage({ destination, airport }: SparseAirportPageProps) {
  const code = airport.code.toUpperCase();
  const cards = [
    { label: "Daytime transit", body: airport.dayTransitRecommendation },
    { label: "Night arrival transit", body: airport.nightTransitRecommendation },
    { label: "Transit warning", body: airport.transitWarning },
    { label: "Cash & ATM strategy", body: airport.cashAtmStrategy },
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <Breadcrumbs
          items={[
            { label: "Playbook", href: "/playbook/" },
            { label: "Destinations", href: "/playbook/destinations/" },
            { label: destination.name, href: `/playbook/destinations/${destination.slug}/` },
            { label: `${code} Arrival` },
          ]}
          className="mb-6"
        />

        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-amber-400 px-3 py-1 font-mono text-base font-black text-slate-950 shadow-2xs">
              {code}
            </span>
            <Badge tone="amber">
              <Icon name="shield" className="size-3" />
              Arrival Essentials
            </Badge>
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
              {destination.country} · Risk tier: {destination.riskTier}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-amber-50">
            {airport.name}
            <span className="block text-amber-600 dark:text-amber-300">
              Arrival essentials for {destination.name}
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            The full {code} ingress hub (train curfews, official taxi-rank coordinates, tout truth
            tables) is not published yet. The essentials below come from the {destination.name}{" "}
            security dossier.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                {card.label}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/50 dark:bg-rose-950/30">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-rose-800 dark:text-rose-300">
            Emergency numbers · {destination.country}
          </span>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm font-bold text-slate-900 dark:text-amber-50">
            <li>Police / general: {destination.emergencyNumbers.generalOrPolice}</li>
            <li>Ambulance: {destination.emergencyNumbers.ambulance}</li>
            {destination.emergencyNumbers.touristPolice ? (
              <li>Tourist police: {destination.emergencyNumbers.touristPolice}</li>
            ) : null}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`/playbook/solo-female/${destination.slug}/night-arrival-transit/`}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-sm font-black text-slate-950 transition hover:bg-amber-300"
          >
            <Icon name="shield" className="size-4" />
            Night-arrival playbook for {destination.name}
          </Link>
          <Link
            href={`/playbook/destinations/${destination.slug}/`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-display text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {destination.name} dossier
            <Icon name="arrowRight" className="size-4" />
          </Link>
          <Link
            href="/playbook/airports/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-display text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            All airport hubs
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
