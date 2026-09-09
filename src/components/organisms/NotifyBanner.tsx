import { Bell, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/atoms";
import { EmailNotify } from "@/components/molecules";

/**
 * ORGANISM — NotifyBanner.
 * Closing CTA. Editorial boxed ground + secondary notify form, doubling the
 * capture surface below the manifesto without being noisy.
 */
export function NotifyBanner() {
  return (
    <section
      aria-labelledby="notify-banner-heading"
      className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-gradient-to-br from-amber-50 to-white p-8 shadow-card sm:p-12 dark:border-white/10 dark:from-slate-900 dark:to-slate-950">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/20"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Get notified"
                title={<span id="notify-banner-heading">One quiet email when we launch.</span>}
                lede="No drip campaigns, no resold lists. The launch announcement, plus a short note from the field when something genuinely changes."
              />
            </div>
            <div className="flex flex-col gap-4">
              <EmailNotify />
              <p className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-amber-50/60">
                <Sparkles className="size-3" aria-hidden="true" /> No spam, ever.
                <Bell className="ml-2 size-3" aria-hidden="true" /> Unsubscribe in one click.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
