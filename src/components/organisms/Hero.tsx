import { Badge, Reveal } from "@/components/atoms";
import { EmailNotify } from "@/components/molecules/EmailNotify";
import { Icon } from "@/components/atoms/Icon";

/**
 * ORGANISM — Hero.
 * Editorial, two-row hero: kicker badge + headline + lede + notify form.
 * Composition-only — the paragraph about solo travel security lives in
 * ManifestoSection so this stays a pure atomic organism.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Decorative gradient ground (no extra DOM nodes needed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(251,191,36,0.18)_0%,rgba(15,23,42,0)_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgba(251,191,36,0.16)_0%,rgba(2,6,23,0)_70%)]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-7 px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28 sm:pb-24">
        <Reveal>
          <Badge tone="amber" tilt="left">
            <Icon name="compass" className="size-3" />
            Coming soon · 2026
          </Badge>
        </Reveal>

        <Reveal delay={80}>
          <h1
            id="hero-heading"
            className="max-w-2xl text-balance font-display text-5xl font-black leading-[0.98] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-amber-50"
          >
            Solo travel,
            <span className="block text-amber-700 dark:text-amber-300">sharply aware.</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="max-w-xl text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-amber-50/75">
            A forthcoming field-tested playbook for solo travellers — situational awareness, scam
            literacy, transit hygiene and calm decision-making, distilled from people who actually
            do this.
          </p>
        </Reveal>

        <Reveal delay={240} className="w-full">
          <div id="notify" className="flex justify-center">
            <EmailNotify idSuffix="-hero" />
          </div>
        </Reveal>

        <Reveal delay={320}>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 dark:text-amber-50/65">
            <li className="inline-flex items-center gap-1.5">
              <Icon name="eye" className="size-3" /> Awareness
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon name="shield" className="size-3" /> Calm
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon name="bell" className="size-3" /> Not paranoia
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
