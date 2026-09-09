"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";

/**
 * MOLECULE — EmailNotify.
 * Minimal, accessible email capture for the coming-soon CTA.
 * POSTs to a Cloudflare Worker endpoint (route stubbed for pre-launch;
 * replace `notifyEndpoint` with your real handler before launch).
 */
const notifyEndpoint = "/api/notify";

type Status = "idle" | "submitting" | "success" | "error";

export function EmailNotify() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch(notifyEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("You're on the list. We'll be in touch.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Couldn't sign you up right now. Try again later.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      aria-label="Notify me when launch"
      noValidate
    >
      <label htmlFor="email-notify" className="sr-only">
        Email address
      </label>
      <div className="relative flex-1">
        <Bell
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-amber-50/40"
          aria-hidden="true"
        />
        <input
          id="email-notify"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          aria-invalid={status === "error"}
          aria-describedby="email-notify-status"
          className="h-12 w-full rounded-full border border-slate-900/15 bg-white pl-11 pr-5 text-base font-medium text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 dark:border-white/15 dark:bg-slate-900 dark:text-amber-50 dark:placeholder:text-amber-50/40"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-900 px-6 text-base font-extrabold text-amber-50 shadow-card transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 dark:focus-visible:ring-offset-slate-950"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span>Signing up…</span>
          </>
        ) : status === "success" ? (
          <>
            <Check className="size-4" aria-hidden="true" />
            <span>Subscribed</span>
          </>
        ) : (
          <>
            <Bell className="size-4" aria-hidden="true" />
            <span>Notify me</span>
          </>
        )}
      </button>
      <p
        id="email-notify-status"
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`text-sm font-semibold ${
          status === "error"
            ? "text-rose-600 dark:text-rose-400"
            : status === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-600 dark:text-amber-50/60"
        }`}
      >
        {message || "One email at launch. No spam, no resale, no growth-hack nonsense."}
      </p>
    </form>
  );
}
