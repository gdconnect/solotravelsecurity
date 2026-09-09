import Link from "next/link";
import { Icon } from "@/components/atoms";

/**
 * ORGANISM — SiteFooter.
 * Quiet footer: brand line, two links, current year. No marketing sprawl.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-slate-900/10 bg-slate-950 text-amber-50 dark:border-white/10">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2">
            <span
              className="grid size-9 place-items-center rounded-xl bg-amber-400 text-slate-950"
              aria-hidden="true"
            >
              <Icon name="shield" className="size-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-black tracking-tight">
              Solo Travel<span className="text-amber-300">Security</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-amber-50/85">
            Awareness, planning and calm for solo travellers moving through unfamiliar places.
            Tactical, not paranoid.
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            Site
          </p>
          <ul className="mt-3 space-y-2 text-sm font-semibold">
            <li>
              <Link href="#about" className="text-amber-50/85 transition hover:text-amber-300">
                About
              </Link>
            </li>
            <li>
              <Link href="#notify" className="text-amber-50/85 transition hover:text-amber-300">
                Get notified
              </Link>
            </li>
            <li>
              <Link href="/llms.txt" className="text-amber-50/85 transition hover:text-amber-300">
                llms.txt
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm font-semibold">
            <li className="inline-flex items-center gap-2 text-amber-50/85">
              <Icon name="mail" className="size-3.5" />
              <a
                href="mailto:hello@solotravelsecurity.com"
                className="transition hover:text-amber-300"
              >
                hello@solotravelsecurity.com
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-amber-50/85">
              <Icon name="code" className="size-3.5" />
              <a
                href="https://github.com/gdconnect/solotravelsecurity"
                className="transition hover:text-amber-300"
                rel="noreferrer noopener"
                target="_blank"
              >
                Source on GitHub
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-amber-50/85">
              <Icon name="globe" className="size-3.5" />
              <span>Built on Cloudflare Workers</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-amber-50/70 sm:flex-row sm:items-center sm:px-6">
          <p>
            © {year} Solo Travel Security. Awareness content only — not legal or security advice.
          </p>
          <p className="font-mono uppercase tracking-wider">Coming soon</p>
        </div>
      </div>
    </footer>
  );
}
