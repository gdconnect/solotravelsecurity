"use client";

import { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Button } from "@/components/atoms/Button";
import { encryptZeroKnowledgePayload } from "@/lib/engine/crypto";

export interface TripwirePanelProps {
  destinationCity: string;
}

export function TripwirePanel({ destinationCity }: TripwirePanelProps) {
  const [status, setStatus] = useState<"IDLE" | "ARMED" | "CHECKED_IN">("IDLE");
  const [contactEmail, setContactEmail] = useState("");
  const [checkinTime, setCheckinTime] = useState("21:00");
  const [hotelNotes, setHotelNotes] = useState("");
  const [encryptedKeyHash, setEncryptedKeyHash] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleArmTripwire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;

    setIsEncrypting(true);
    try {
      const sensitiveData = {
        destinationCity,
        contactEmail,
        checkinTime,
        hotelNotes: hotelNotes || "Staying at hotel in " + destinationCity,
        timestamp: new Date().toISOString(),
      };

      const { secretKeyFragment } = await encryptZeroKnowledgePayload(sensitiveData);
      setEncryptedKeyHash(secretKeyFragment);
      setStatus("ARMED");
    } catch (err) {
      console.error("Encryption error:", err);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handlePulseCheckIn = () => {
    setStatus("CHECKED_IN");
  };

  const handleDisarm = () => {
    setStatus("IDLE");
    setEncryptedKeyHash(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Preview · No Alerts Sent
          </span>
          <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
            Tripwire Dead-Man Escalation Ladder
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-mono text-xs font-black uppercase tracking-wider ${
              status === "ARMED"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                : status === "CHECKED_IN"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                  : "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                status === "ARMED"
                  ? "animate-pulse bg-amber-500"
                  : status === "CHECKED_IN"
                    ? "bg-emerald-500"
                    : "bg-slate-400"
              }`}
            />
            {status}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        Preview of the escalation ladder. When live: miss your check-in window and grace period, and
        your designated contact is emailed a decrypted emergency pack. This preview stores nothing
        and sends no alerts.
      </p>

      {status === "IDLE" && (
        <form onSubmit={handleArmTripwire} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Home Contact Email:
              </label>
              <input
                type="email"
                required
                placeholder="parent-or-partner@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Daily Check-In Target (Local Time in {destinationCity}):
              </label>
              <input
                type="time"
                value={checkinTime}
                onChange={(e) => setCheckinTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Encrypted Hotel / Room Notes (Decrypted ONLY if check-in missed):
            </label>
            <textarea
              rows={2}
              placeholder="Hotel name, room number, or local contact details (encrypted in browser with AES-256-GCM)..."
              value={hotelNotes}
              onChange={(e) => setHotelNotes(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="amber" type="submit" disabled={isEncrypting}>
              <Icon name="shield" className="size-3.5" />
              {isEncrypting ? "Encrypting with Web Crypto..." : "Preview Tripwire (No Alerts Sent)"}
            </Button>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              2-Hour Grace Period (planned)
            </span>
          </div>
        </form>
      )}

      {status === "ARMED" && (
        <div className="mt-6 space-y-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-black text-amber-800 dark:text-amber-300">
                Preview · Check-in target {checkinTime} (Local Time)
              </span>
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                Emergency Contact: <strong className="font-bold">{contactEmail}</strong>
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              Preview Only · No Alarm Scheduled
            </span>
          </div>

          {encryptedKeyHash && (
            <div className="rounded-lg bg-white/70 p-3 text-xs dark:bg-slate-950/70">
              <span className="block font-mono text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Zero-Knowledge URL Fragment Key (Stored only on your client):
              </span>
              <code className="mt-1 block break-all font-mono text-[11px] font-bold text-amber-800 dark:text-amber-200">
                {encryptedKeyHash}
              </code>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="amber" onClick={handlePulseCheckIn}>
              <Icon name="check" className="size-4" />
              Tap to Confirm &quot;I Am Safe&quot;
            </Button>
            <button
              type="button"
              onClick={handleDisarm}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Disarm & Clear Alarm
            </button>
          </div>
        </div>
      )}

      {status === "CHECKED_IN" && (
        <div className="mt-6 space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          <div className="flex items-center gap-2 font-display text-sm font-black">
            <Icon name="check" className="size-4 text-emerald-700 dark:text-emerald-400" />
            Check-In Pulse Recorded Successfully
          </div>
          <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80">
            Preview cleared. No alert was sent to your contact.
          </p>
          <button
            type="button"
            onClick={handleDisarm}
            className="rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3 py-1.5 font-mono text-xs font-bold text-emerald-900 dark:text-emerald-300"
          >
            Reset for Tomorrow
          </button>
        </div>
      )}
    </div>
  );
}
