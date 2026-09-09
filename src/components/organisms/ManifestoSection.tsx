import { Reveal, SectionHeading } from "@/components/atoms";
import { PrincipleList } from "@/components/molecules";

/**
 * ORGANISM — ManifestoSection.
 * The paragraph about solo travel security, structured as an intro + 6
 * operating principles. Stays KISS: pure composition, no state.
 */
export function ManifestoSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 pt-16 pb-10 sm:px-6 sm:pt-24"
    >
      <Reveal>
        <SectionHeading
          index="01"
          eyebrow="The playbook"
          title="Solo travel security is a calm operating system."
          lede="Not a checklist, not a fortress mindset. A few habits, applied consistently, that turn unfamiliar streets into navigable ones."
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Reveal delay={80}>
          <div className="prose prose-slate max-w-none text-pretty text-base leading-relaxed text-slate-700 sm:text-lg dark:prose-invert dark:text-amber-50/80">
            <p>
              Travelling alone is one of the most rewarding things a person can do — and one of the
              most exposed. You don’t have a partner to glance at when something feels wrong. You
              don’t have someone to spell your name at a hotel desk, or to watch your bag while you
              use the bathroom. The whole weight of every small decision — which cab, which seat,
              which door — lands on you.
            </p>
            <p>
              The point of solo travel security isn’t fear. It’s removing friction from the moments
              that matter, so your attention stays on the place you’re visiting instead of the
              threat model. The right preparation is quiet: a few habits rehearsed at home, a small
              kit in your daypack, a short list of scams to recognise in each new city, and a clear
              fallback if something does go sideways.
            </p>
            <p>
              Solo Travel Security is being built to be that short list. Field-tested practices from
              people who actually travel alone, organised by the moments you’ll face — arriving
              late, picking a hotel, taking a cab, pulling cash, dealing with an unfamiliar
              consulate. When a recommendation is paid or affiliate, it’s labelled as such.
              Everything else is just the playbook.
            </p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <PrincipleList
            tone="amber"
            items={[
              {
                icon: "eye",
                title: "Awareness, not anxiety",
                body: "Notice your surroundings on your own terms. Anxiety narrows attention; awareness widens it.",
              },
              {
                icon: "map",
                title: "Pre-load the city",
                body: "Read about common scams and the safe transit options before you land. Surprises are the real risk.",
              },
              {
                icon: "hotel",
                title: "Vet the room, not just the price",
                body: "Locks, exits, neighbours, lighting, and the walk from the door to the elevator.",
              },
              {
                icon: "card",
                title: "Two cards, two pockets",
                body: "Carry one, stash one. Notify your bank. Use the local SIM or eSIM for everything that matters.",
              },
              {
                icon: "phone",
                title: "A check-in that actually fires",
                body: "A trusted contact, a scheduled message, and a backup who knows your itinerary end-to-end.",
              },
              {
                icon: "shieldAlert",
                title: "A clean fallback ladder",
                body: "Local emergency, nearest consulate, embassy hotline, and the airline's after-hours desk — all in one note.",
              },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
