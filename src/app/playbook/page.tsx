import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, SectionHeading } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { TOP_SOLO_DESTINATIONS } from "@/data/destinations";
import { ARCHETYPES } from "@/data/archetypes";
import { SECURITY_VECTORS } from "@/data/vectors";
import { getAllCountries } from "@/data/geo/countries";
import { PREPOPULATED_AIRPORTS } from "@/data/lego/airports";
import { CitySearchCombobox } from "@/components/molecules";

export const metadata: Metadata = {
  title: "Field Playbook Directory | Solo Travel Security",
  description:
    "Browse field-tested safety playbooks, scam guides, and transit protocols for solo travelers across global destinations.",
};

export default function PlaybookIndexPage() {
  const countries = getAllCountries();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <Reveal>
          <Badge tone="amber">
            <Icon name="compass" className="size-3" />
            Field Intelligence
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            The Solo Travel
            <span className="block text-amber-700 dark:text-amber-300">Playbook Directory.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            Deterministic operational protocols organized by city, country, traveler profile, and
            security vector. Built for awareness, not anxiety.
          </p>

          <div className="mt-8 max-w-xl">
            <CitySearchCombobox placeholder="Search any city or country (e.g. Rome, Tokyo, Japan)..." />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/portal/"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 font-display text-xs font-black text-slate-950 shadow-xs transition hover:bg-amber-300"
            >
              <Icon name="shield" className="size-3.5" />
              Private Traveler Command Portal →
            </Link>
            <Link
              href="/playbook/checklists/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-display text-xs font-bold text-slate-800 shadow-xs transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon name="check" className="size-3.5 text-amber-600" />
              Security Checklists & Scoring Matrices →
            </Link>
            <Link
              href="/playbook/decision-matrices/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-display text-xs font-bold text-slate-800 shadow-xs transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Icon name="table" className="size-3.5 text-amber-600" />
              Decision & Truth Tables →
            </Link>
            <Link
              href="/playbook/airports/"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-2.5 font-display text-xs font-bold text-amber-900 shadow-xs transition hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
            >
              <Icon name="compass" className="size-3.5 text-amber-600" />
              Airport Ingress & Late-Night Guides →
            </Link>
          </div>
        </Reveal>

        {/* SECTION 1: Top 10 Solo Travel Destinations */}
        <section className="mt-16">
          <SectionHeading
            index="01"
            eyebrow="Global Hubs"
            title="City Safety Dossiers"
            lede="Verified transit hygiene, local scam directories, emergency numbers, and safe neighborhoods."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_SOLO_DESTINATIONS.map((dest) => (
              <Link
                key={dest.slug}
                href={`/playbook/destinations/${dest.slug}/`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {dest.country}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        dest.riskTier === "Low"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                          : dest.riskTier === "Moderate"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {dest.riskTier} Risk
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-black text-slate-900 transition group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                    {dest.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    Emergency: Police {dest.emergencyNumbers.generalOrPolice} · Ambulance{" "}
                    {dest.emergencyNumbers.ambulance}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <span>{dest.topScams.length} Scams Inoculated</span>
                  <Icon
                    name="arrowRight"
                    className="size-3.5 transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: Sovereign Country Dossiers */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <SectionHeading
              index="02"
              eyebrow="Sovereign Protocols"
              title="Country Security Dossiers"
              lede="Nationwide police and medical dispatch, consular crisis lines, electrical voltage, and currency rules."
            />
            <Link
              href="/playbook/countries"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-700 hover:underline dark:text-amber-400 shrink-0"
            >
              Explore All {countries.length} Countries
              <Icon name="arrowRight" className="size-3" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {countries.slice(0, 8).map((country) => (
              <Link
                key={country.iso2}
                href={`/playbook/countries/${country.iso2.toLowerCase()}/`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                      {country.iso2}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        country.defaultRiskTier === "Low"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                          : country.defaultRiskTier === "Moderate"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {country.defaultRiskTier}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-black text-slate-900 transition group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                    {country.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                    Police {country.emergencyNumbers.police} · {country.currencyCode} ·{" "}
                    {country.electricalStandards.voltage}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <span>View Protocol</span>
                  <Icon name="arrowRight" className="size-3 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 3: Traveler Archetypes */}
        <section className="mt-20">
          <SectionHeading
            index="03"
            eyebrow="Targeted Profiles"
            title="Traveler Archetype Playbooks"
            lede="Threat modeling and operational habits tailored to your demographic and travel style."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHETYPES.map((arch) => (
              <Link
                key={arch.slug}
                href={`/playbook/archetypes/${arch.slug}/`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Profile Guide
                  </span>
                  <h3 className="mt-2 font-display text-xl font-black text-slate-900 transition group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                    {arch.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {arch.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <span>{arch.recommendedGear.length} Core Gear Items</span>
                  <Icon
                    name="arrowRight"
                    className="size-3.5 transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 4: Security Vectors */}
        <section className="mt-20">
          <SectionHeading
            index="04"
            eyebrow="Tactical Transitions"
            title="Universal Security Vectors"
            lede="The specific high-friction moments where solo travelers experience peak exposure."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_VECTORS.map((vec) => (
              <Link
                key={vec.slug}
                href={`/playbook/topics/${vec.slug}/`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Vector Protocol
                  </span>
                  <h3 className="mt-2 font-display text-xl font-black text-slate-900 transition group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                    {vec.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {vec.tagline}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 font-mono text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  <span>{vec.actionProtocol.length} Protocol Steps</span>
                  <Icon
                    name="arrowRight"
                    className="size-3.5 transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 05: Airport Ingress Nodes & Late Night Guides */}
        <section className="mt-20">
          <SectionHeading
            index="05"
            eyebrow="Ingress Choke-Points"
            title="Airport Security Hubs & Curfew Guides"
            lede="Deterministic decision tables, express train curfews, and official taxi stand blueprints for international arrivals."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PREPOPULATED_AIRPORTS.map((airport) => (
              <Link
                key={airport.iata}
                href={`/playbook/airports/${airport.iata.toLowerCase()}/`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 font-mono text-xs font-black text-amber-950 dark:bg-amber-950/60 dark:text-amber-200">
                      {airport.iata}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      Last Train: {airport.lateNightCurfew.expressRailLastDeparture}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-black text-slate-900 transition group-hover:text-amber-600 dark:text-amber-50 dark:group-hover:text-amber-300">
                    {airport.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-slate-500">
                    📍 {airport.city}, {airport.country}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {airport.officialTaxi.fareStructure === "flat_rate"
                      ? `€${airport.officialTaxi.flatRateCityCenterEur || 50} fixed flat rate. Anti-tout kiosk at ${airport.officialTaxi.curbFloorLevel}.`
                      : `Metered taxi with official kiosk at ${airport.officialTaxi.curbFloorLevel}.`}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs font-bold text-amber-600 dark:border-slate-800">
                  <span>Explore Ingress Protocol</span>
                  <Icon
                    name="arrowRight"
                    className="size-3.5 transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
