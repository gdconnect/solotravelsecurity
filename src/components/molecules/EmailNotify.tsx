import { Icon } from "@/components/atoms";

/**
 * MOLECULE — EmailNotify (server-rendered, native submit).
 *
 * Plain HTML form — POSTs to /api/notify via native browser submit. No
 * "use client", no JS, no hydration. Users without JS still get the form
 * working. Progressive enhancement: layer fetch + status UI on top later.
 */
const notifyEndpoint = "/api/notify";

export function EmailNotify({ idSuffix = "" }: { idSuffix?: string }) {
  const formId = `email-notify-form${idSuffix}`;
  return (
    <form
      id={formId}
      action={notifyEndpoint}
      method="post"
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      aria-label="Notify me when launch"
    >
      <label htmlFor={`email-notify${idSuffix}`} className="sr-only">
        Email address
      </label>
      <div className="relative flex-1">
        <Icon
          name="bell"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-amber-50/40"
        />
        <input
          id={`email-notify${idSuffix}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          className="h-12 w-full rounded-full border border-slate-900/15 bg-white pl-11 pr-5 text-base font-medium text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 dark:border-white/15 dark:bg-slate-900 dark:text-amber-50 dark:placeholder:text-amber-50/40"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-900 px-6 text-base font-extrabold text-amber-50 shadow-card transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 dark:focus-visible:ring-offset-slate-950"
      >
        <Icon name="bell" className="size-4" />
        <span>Notify me</span>
      </button>
      <p className="text-sm font-semibold text-slate-700 dark:text-amber-50/75">
        One email at launch. No spam, no resale, no growth-hack nonsense.
      </p>
    </form>
  );
}
