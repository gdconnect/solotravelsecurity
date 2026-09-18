"use client";

import { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import type { TripPlan, TravelerPersona } from "@/lib/personalization/types";
import { generatePreTripBriefingEmail } from "@/lib/personalization/email-templates";

interface EmailBriefingModalProps {
  trip: TripPlan;
  persona: TravelerPersona;
  onClose: () => void;
}

export function EmailBriefingModal({ trip, persona, onClose }: EmailBriefingModalProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");

  const email = generatePreTripBriefingEmail(trip, persona);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email.textBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-400 p-1.5 text-slate-950">
              <Icon name="mail" className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                Pre-Trip Safety Briefing Email
              </h3>
              <p className="text-xs text-slate-500">
                Dispatch itinerary & escalation ladder to designated emergency contacts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Email Meta details */}
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 font-mono text-xs dark:bg-slate-950">
          <div>
            <span className="text-slate-500">Recipient: </span>
            <strong className="text-slate-900 dark:text-amber-50">
              {persona.emergencyContacts[0]?.email || "(No email set in profile)"}
            </strong>{" "}
            ({persona.emergencyContacts[0]?.name})
          </div>
          <div>
            <span className="text-slate-500">Subject: </span>
            <strong className="text-slate-900 dark:text-amber-50">{email.subject}</strong>
          </div>
        </div>

        {/* View toggle */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("rendered")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                viewMode === "rendered"
                  ? "bg-white shadow-xs text-slate-900 dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                viewMode === "raw"
                  ? "bg-white shadow-xs text-slate-900 dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Plain Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-display text-xs font-bold text-slate-700 shadow-xs hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Icon name="fileText" className="size-3.5" />
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>

            <a
              href={email.mailtoUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-1.5 font-display text-xs font-black text-slate-950 shadow-xs hover:bg-amber-300"
            >
              <Icon name="mail" className="size-3.5" />
              <span>Open in Email Client</span>
            </a>
          </div>
        </div>

        {/* Email Content Box */}
        <div className="mt-4 max-h-[45vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          {viewMode === "rendered" ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 dark:text-slate-300">
              {email.textBody}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
          <span className="font-mono text-[10px] text-slate-500">
            Establishes agreed escalation protocol before departure.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 font-display text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
