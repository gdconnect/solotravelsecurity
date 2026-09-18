import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { SECURITY_VECTORS, getVectorBySlug } from "@/data/vectors";
import { ARCHETYPES, getArchetypeBySlug } from "@/data/archetypes";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";

interface RelatedPlaybooksGridProps {
  currentArchetypeSlug: string;
  currentDestinationSlug: string;
  currentVectorSlug: string;
}

export function RelatedPlaybooksGrid({
  currentArchetypeSlug,
  currentDestinationSlug,
  currentVectorSlug,
}: RelatedPlaybooksGridProps) {
  const dest = getDestinationBySlug(currentDestinationSlug);
  const arch = getArchetypeBySlug(currentArchetypeSlug);
  const currentVec = getVectorBySlug(currentVectorSlug);

  if (!dest || !arch || !currentVec) return null;

  // 1. Sibling vectors in same destination
  const siblingVectors = SECURITY_VECTORS.filter((v) => v.slug !== currentVectorSlug);

  // 2. Sibling archetypes in same destination
  const siblingArchetypes = ARCHETYPES.filter((a) => a.slug !== currentArchetypeSlug);

  // 3. Sister destinations
  const sisterDestinations = TOP_SOLO_DESTINATIONS.filter(
    (d) => d.slug !== currentDestinationSlug,
  ).slice(0, 4);

  return (
    <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Programmatic Knowledge Mesh
        </span>
        <h2 className="font-display text-2xl font-black text-slate-900 dark:text-amber-50">
          Related Security Playbooks & Regional Hubs
        </h2>
        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
          Cross-referenced intelligence to complete your security blueprint for {dest.name}.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        {/* Sibling Vectors */}
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-200">
            <Icon name="shield" className="size-4 text-amber-600 dark:text-amber-400" />
            Complete the {dest.name} Defense Matrix ({arch.name})
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblingVectors.map((vec) => (
              <Link
                key={vec.slug}
                href={`/playbook/${arch.slug}/${dest.slug}/${vec.slug}/`}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-amber-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-amber-500/50"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-amber-700 dark:text-amber-50 dark:group-hover:text-amber-300">
                  <span>{vec.title}</span>
                  <Icon
                    name="arrowRight"
                    className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-amber-600"
                  />
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-2">
                  {vec.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Other Archetypes */}
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-200">
            <Icon name="compass" className="size-4 text-amber-600 dark:text-amber-400" />
            {dest.name} Playbooks for Other Travel Profiles
          </h3>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {siblingArchetypes.map((a) => (
              <Link
                key={a.slug}
                href={`/playbook/${a.slug}/${dest.slug}/${currentVec.slug}/`}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs font-medium text-slate-700 transition-colors hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-amber-300"
              >
                {a.name} →
              </Link>
            ))}
          </div>
        </div>

        {/* Sister Destinations */}
        <div>
          <h3 className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-200">
            <Icon name="globe" className="size-4 text-amber-600 dark:text-amber-400" />
            Compare Safety in Sister Solo Destinations
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sisterDestinations.map((sister) => (
              <Link
                key={sister.slug}
                href={`/playbook/${arch.slug}/${sister.slug}/${currentVec.slug}/`}
                className="rounded-xl border border-slate-200 bg-white p-3.5 transition-all hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="font-display text-xs font-black text-slate-900 dark:text-amber-50">
                  {sister.name}, {sister.country}
                </div>
                <div className="mt-1 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                  Risk Tier: {sister.riskTier}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Airport Hubs and Global Search Shortcuts */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
                Explore All Intelligence for {dest.name}
              </h4>
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                Faceted search over gear, truth tables, customs regulations, and scam databases.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {dest.arrivalAirports.map((airport) => (
                <Link
                  key={airport.code}
                  href={`/playbook/airports/${airport.code.toLowerCase()}/`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-900 hover:border-amber-400 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300"
                >
                  <Icon name="mapPin" className="size-3 text-amber-600" />
                  <span>{airport.code} Ingress Hub</span>
                </Link>
              ))}

              <Link
                href={`/playbook/search/?q=${encodeURIComponent(dest.name)}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 font-display text-xs font-black text-slate-950 hover:bg-amber-400"
              >
                <Icon name="search" className="size-3" />
                <span>Search {dest.name} Database</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
