import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/templates/PageShell";
import { Badge, Reveal, SectionHeading, JsonLd } from "@/components/atoms";
import { Icon } from "@/components/atoms/Icon";
import { SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "The Guardian Pass for Parents | Solo Travel Security",
  description:
    "Autonomous for the traveler. Calm for the parent. The privacy-first solo travel safety platform with one-tap touchdown heartbeats, verified transit timelines, and zero-panic emergency consular packets.",
  openGraph: {
    title: "The Guardian Pass for Parents | Solo Travel Security",
    description:
      "Send them into the world with confidence, not anxiety. Event-driven check-ins, pre-vetted emergency dispatch, and peace of mind.",
    type: "website",
  },
};

export default function ParentsLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/parents#service`,
        name: "The Guardian Pass for Solo Travel Parents",
        description:
          "Privacy-first parent monitoring and emergency escalation network for solo travelers.",
        provider: {
          "@type": "Organization",
          name: "Solo Travel Security",
          url: SITE_URL,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/parents#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How is the Guardian Pass different from Life360 or Apple FindMy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Life360 continuously tracks GPS dots, which drains battery, creates friction with teenagers who feel surveilled, and creates more anxiety when they enter an unfamiliar street. The Guardian Pass is event-driven: travelers tap verified heartbeats (Touchdown, Transit, Lodging), and parents get calm, structured operational reports without invasive surveillance.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if my child misses a scheduled check-in?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Planned escalation ladder: a silent nudge goes to the traveler first. If still unconfirmed after the grace period, parents receive a calm alert with the local emergency number, the embassy crisis desk, and the lodging reception contact.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "For Parents" },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-400">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <span className="font-bold text-amber-700 dark:text-amber-400">For Parents</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="amber">
              <Icon name="shield" className="size-3" />
              The Guardian Pass
            </Badge>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Preview · Passes Not Yet On Sale
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-amber-50">
            Send them into the world with confidence.
            <span className="block text-amber-700 dark:text-amber-300">Not anxiety.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
            The privacy-first travel safety platform built for solo explorers and the parents who
            love them. No awkward daily interrogation calls. Just verified touchdown heartbeats,
            structured transit timelines, and pre-loaded consular emergency dispatch.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/guardian/rome"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-display text-sm font-black text-slate-950 transition hover:bg-amber-300"
            >
              <Icon name="eye" className="size-4" />
              View Parent Portal Demo
            </Link>
            <Link
              href="#comparison"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 font-display text-sm font-bold text-slate-800 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Why Life360 Fails for Travel
            </Link>
          </div>
        </Reveal>

        {/* SECTION 1: Comparison Grid */}
        <section id="comparison" className="mt-20">
          <SectionHeading
            index="01"
            eyebrow="The Paradigm Shift"
            title="Why Travelers and Parents Both Prefer Guardian Over Life360"
            lede="Continuous surveillance causes friction and anxiety. Event-driven operational heartbeats create calm."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Life360 / FindMy Box */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 dark:border-rose-500/30 dark:bg-rose-950/20">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/20 text-xs font-bold text-rose-700 dark:text-rose-300">
                  ✕
                </span>
                <h3 className="font-display text-lg font-black text-rose-900 dark:text-rose-200">
                  Continuous GPS Apps (Life360 / FindMy)
                </h3>
              </div>

              <ul className="mt-5 space-y-3 font-medium text-xs leading-relaxed text-rose-800 dark:text-rose-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Travelers resent it:</strong> Feels like an invasive digital ankle
                    monitor. Teenagers and young adults turn off location sharing.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Drains battery:</strong> Constant GPS pinging kills mobile phone battery
                    in transit hubs when they need it most.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Induces parental panic:</strong> Watching a static blue dot on an
                    unfamiliar map in Rome or Bangkok at 2:00 AM creates terror without context.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Zero contingency data:</strong> If the phone goes offline, the app
                    offers no embassy lines, local police numbers, or hotel contacts.
                  </span>
                </li>
              </ul>
            </div>

            {/* Guardian Pass Box */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 dark:border-emerald-500/30 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  ✓
                </span>
                <h3 className="font-display text-lg font-black text-emerald-900 dark:text-emerald-200">
                  The Solo Travel Guardian Pass
                </h3>
              </div>

              <ul className="mt-5 space-y-3 font-medium text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Travelers love it:</strong> Zero live GPS tracking. They simply tap one
                    button at Touchdown and one at Lodging. Independence is preserved.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Zero battery drain:</strong> Uses lightweight web push / SMS; zero
                    continuous background location services required.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Reassuring context:</strong> You receive a calm notification:{" "}
                    <em>“Maya touched down at FCO. Transit via Leonardo Express confirmed.”</em>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <strong>Pre-loaded rescue packet:</strong> Instant access to local consular
                    emergency desks, 24/7 English police dispatch, and lodging front desks.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: How It Works */}
        <section className="mt-20">
          <SectionHeading
            index="02"
            eyebrow="The Operating System"
            title="The 3-Tier Safe Passage Protocol"
            lede="Structured preparation before wheels up, frictionless check-ins on the ground, and calm, pre-planned contingencies."
          />

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 font-mono text-sm font-black text-amber-700 dark:text-amber-400">
                01
              </div>
              <h3 className="mt-4 font-display text-lg font-black text-slate-900 dark:text-amber-50">
                Pre-Trip Safety Audit
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Your child completes our 90-second operational audit covering ATM card segregation,
                offline navigation, and safe arrival transit. You receive their certified Readiness
                Scorecard.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 font-mono text-sm font-black text-emerald-700 dark:text-emerald-400">
                02
              </div>
              <h3 className="mt-4 font-display text-lg font-black text-slate-900 dark:text-amber-50">
                1-Tap Ingress Heartbeats
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Upon landing and arriving at lodging, they tap a single button. Their check-in is
                recorded and you see a calm status update in your Guardian portal.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 font-mono text-sm font-black text-rose-700 dark:text-rose-400">
                03
              </div>
              <h3 className="mt-4 font-display text-lg font-black text-slate-900 dark:text-amber-50">
                Zero-Panic Escalation
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                If a transit window is missed, the protocol nudges the traveler silently first. If
                unconfirmed, you receive an immediate, actionable incident dossier with one-tap
                embassy lines.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Pricing Cards */}
        <section className="mt-20">
          <SectionHeading
            index="03"
            eyebrow="Affordable Peace of Mind"
            title="Choose Your Guardian Pass"
            lede="A fraction of the price of an airline ticket. Invaluable security for the entire family."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Single Trip Pass */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Single Journey
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black text-slate-900 dark:text-amber-50">
                    $39
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    / trip (up to 30 days)
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Ideal for spring break, semester holidays, or a first-time two-week solo trip
                  abroad.
                </p>

                <ul className="mt-6 space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Full Guardian Command Portal Access
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Ingress Check-In Windows
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Pre-loaded Consular & Police Emergency Packet
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Heartbeat Alerts to Parents
                  </li>
                </ul>
              </div>

              <Link
                href="/guardian/rome"
                className="mt-8 block w-full rounded-2xl bg-slate-900 py-3.5 text-center font-display text-sm font-bold text-amber-50 transition hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
              >
                Preview the Portal (Demo)
              </Link>
            </div>

            {/* Gap Year Pass */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-amber-400 bg-white p-8 shadow-xl dark:border-amber-400/80 dark:bg-slate-900">
              <div className="absolute -top-3.5 right-6 rounded-full bg-amber-400 px-3 py-0.5 font-mono text-[10px] font-black uppercase text-slate-950">
                Most Popular for Students
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Gap Year & Nomad Pass
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black text-slate-900 dark:text-amber-50">
                    $129
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    / full year
                  </span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Continuous multi-country protection for study abroad students, backpackers, and
                  digital nomads.
                </p>

                <ul className="mt-6 space-y-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Unlimited Trips & Global Country Hops
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Continuous Check-In Monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Physical Laminated Pocket Folio Shipped to Home
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="check" className="size-4 text-emerald-500" />
                    Priority Emergency Family Support
                  </li>
                </ul>
              </div>

              <Link
                href="/guardian/rome"
                className="mt-8 block w-full rounded-2xl bg-amber-400 py-3.5 text-center font-display text-sm font-black text-slate-950 transition hover:bg-amber-300"
              >
                Preview the Portal (Demo)
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: Parent FAQs */}
        <section className="mt-20">
          <SectionHeading
            index="04"
            eyebrow="Frequently Asked Questions"
            title="Common Questions from Parents"
            lede="Everything you need to know about our privacy boundaries and emergency dispatch."
          />

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                Will this annoy my child or make them feel micromanaged?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                No. In fact, travelers love the Guardian Pass because it stops the frantic daily{" "}
                <em>“Where are you? Are you safe? Call me!”</em> texts from parents. They tap one
                button when they land, one when they reach their hotel, and you get immediate peace
                of mind without intruding on their journey.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
                What happens if my child loses phone service or their battery dies?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                The Guardian Pass includes pre-trip verification ensuring they carry a portable
                power bank and pre-loaded eSIM. If their check-in is late, the escalation protocol
                applies a grace buffer before notifying you, providing their exact pre-arranged
                lodging phone number and flight details so you have zero guesswork.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
