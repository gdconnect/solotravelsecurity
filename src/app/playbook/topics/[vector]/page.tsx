import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SECURITY_VECTORS, getVectorBySlug } from "@/data/vectors";
import { TOP_SOLO_DESTINATIONS } from "@/data/destinations";
import { ARCHETYPES } from "@/data/archetypes";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, SectionHeading, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";

interface VectorHubProps {
  params: Promise<{ vector: string }>;
}

export async function generateStaticParams() {
  return SECURITY_VECTORS.map((v) => ({
    vector: v.slug,
  }));
}

export async function generateMetadata({ params }: VectorHubProps): Promise<Metadata> {
  const { vector: slug } = await params;
  const vec = getVectorBySlug(slug);

  if (!vec) {
    return { title: "Security Vector | Solo Travel Security" };
  }

  const title = `${vec.title}: Operational Field Protocol`;
  const description = `${vec.tagline} Universal safety habits and step-by-step action rules for solo travelers.`;

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

export default async function VectorHubPage({ params }: VectorHubProps) {
  const { vector: slug } = await params;
  const vec = getVectorBySlug(slug);

  if (!vec) {
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
            name: "Topics",
            item: "https://solotravelsecurity.com/playbook",
          },
          { "@type": "ListItem", position: 4, name: vec.shortLabel },
        ],
      },
      {
        "@type": "HowTo",
        name: vec.title,
        description: vec.primaryJob,
        step: vec.actionProtocol.map((s) => ({
          "@type": "HowToStep",
          name: s.title,
          text: s.instruction,
          position: s.step,
        })),
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
              <span className="text-amber-700 dark:text-amber-400 font-bold">{vec.shortLabel}</span>
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <Reveal>
          <Badge tone="amber">
            <Icon name="shield" className="size-3" />
            Universal Security Vector
          </Badge>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            {vec.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            {vec.tagline}
          </p>

          <div className="mt-6 rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-200">
            <strong className="font-bold">Core Operating Rule:</strong> {vec.coreRule}
          </div>
        </Reveal>

        {/* SECTION 1: Action Protocol */}
        <section className="mt-16">
          <SectionHeading
            index="01"
            eyebrow="Step-by-Step"
            title="The Universal Action Protocol"
            lede="Four deterministic steps to execute whenever you face this transition."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {vec.actionProtocol.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400 font-mono text-xs font-black text-slate-950">
                    {step.step}
                  </span>
                  <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Destination Specific Playbooks for this Vector */}
        <section className="mt-16">
          <SectionHeading
            index="02"
            eyebrow="City Directory"
            title={`${vec.shortLabel} Guides by Destination`}
            lede={`Select a city to see how this protocol applies to local transport, scams, and accommodation.`}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_SOLO_DESTINATIONS.map((dest) => (
              <div
                key={dest.slug}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                    {dest.name}
                  </h3>
                  <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400">
                    {dest.country}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {ARCHETYPES.slice(0, 3).map((arch) => (
                    <Link
                      key={arch.slug}
                      href={`/playbook/${arch.slug}/${dest.slug}/${vec.slug}/`}
                      className="group flex items-center justify-between text-xs text-slate-700 transition hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-400"
                    >
                      <span className="truncate">{arch.shortLabel}</span>
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
