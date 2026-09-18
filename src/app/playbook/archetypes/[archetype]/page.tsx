import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ARCHETYPES, getArchetypeBySlug } from "@/data/archetypes";
import { TOP_SOLO_DESTINATIONS } from "@/data/destinations";
import { SECURITY_VECTORS } from "@/data/vectors";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, SectionHeading, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";

interface ArchetypeHubProps {
  params: Promise<{ archetype: string }>;
}

export async function generateStaticParams() {
  return ARCHETYPES.map((a) => ({
    archetype: a.slug,
  }));
}

export async function generateMetadata({ params }: ArchetypeHubProps): Promise<Metadata> {
  const { archetype: slug } = await params;
  const arch = getArchetypeBySlug(slug);

  if (!arch) {
    return { title: "Traveler Playbook | Solo Travel Security" };
  }

  const title = `${arch.name} Travel Security Playbook & Operating System`;
  const description = `${arch.heroHeadline} Field-tested security habits, gear recommendations, and destination-specific protocols for ${arch.name.toLowerCase()}s.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function ArchetypeHubPage({ params }: ArchetypeHubProps) {
  const { archetype: slug } = await params;
  const arch = getArchetypeBySlug(slug);

  if (!arch) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://solotravelsecurity.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Playbook",
            item: "https://solotravelsecurity.com/playbook",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Archetypes",
            item: "https://solotravelsecurity.com/playbook",
          },
          { "@type": "ListItem", position: 4, name: arch.name },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumb row */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-400">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/playbook" className="hover:text-amber-700 dark:hover:text-amber-400">
                Playbook
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="text-amber-700 dark:text-amber-400 font-bold">{arch.name}</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <Reveal>
          <Badge tone="amber">
            <Icon name="shield" className="size-3" />
            Traveler Profile Guide
          </Badge>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            The {arch.name}
            <span className="block text-amber-700 dark:text-amber-300">Security Playbook.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            {arch.heroHeadline}
          </p>
        </Reveal>

        {/* SECTION 1: Core Threat Model & Concerns */}
        <section className="mt-16">
          <SectionHeading
            index="01"
            eyebrow="Threat Modeling"
            title="Core Vulnerabilities & Operational Focus"
            lede="The specific friction points that target this demographic when moving through unfamiliar geography."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {arch.coreConcerns.map((concern, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-black text-slate-950">
                  {idx + 1}
                </span>
                <p className="text-xs font-bold leading-relaxed text-slate-900 dark:text-amber-50">
                  {concern}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Recommended Field Kit */}
        <section className="mt-16">
          <SectionHeading
            index="02"
            eyebrow="Field Hardware"
            title="Recommended Gear & Equipment"
            lede="Low-profile physical items that provide mechanical backup without attracting attention."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {arch.recommendedGear.map((gear, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <Icon
                  name="check"
                  className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                />
                <span className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {gear}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: City Playbooks for this Archetype */}
        <section className="mt-16">
          <SectionHeading
            index="03"
            eyebrow="Destination Directory"
            title={`${arch.shortLabel} City Guides`}
            lede={`Select a destination to view tailored ${arch.name.toLowerCase()} safety protocols.`}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_SOLO_DESTINATIONS.map((dest) => (
              <div
                key={dest.slug}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                    {dest.name}, {dest.country}
                  </h3>
                  <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    {dest.riskTier} Risk
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {SECURITY_VECTORS.slice(0, 3).map((vec) => (
                    <Link
                      key={vec.slug}
                      href={`/playbook/${arch.slug}/${dest.slug}/${vec.slug}/`}
                      className="group flex items-center justify-between text-xs text-slate-700 transition hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400"
                    >
                      <span className="truncate">{vec.shortLabel}</span>
                      <Icon
                        name="arrowRight"
                        className="size-3 transition group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
