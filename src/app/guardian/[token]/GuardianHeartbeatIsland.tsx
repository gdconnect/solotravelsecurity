"use client";

import { useState, useCallback } from "react";
import { fetchGraphQL } from "@/lib/graphql/fetch";
import { ConfirmHeartbeatDocument } from "@/lib/graphql/__generated__/documents";
import type { ConfirmHeartbeatMutation } from "@/lib/graphql/__generated__/types";
import { Icon } from "@/components/atoms/Icon";
import type { ValidatedGuardianPortal } from "@/lib/schemas/guardian";

interface GuardianHeartbeatIslandProps {
  initialPortal: ValidatedGuardianPortal;
}

export function GuardianHeartbeatIsland({ initialPortal }: GuardianHeartbeatIslandProps) {
  const [milestones, setMilestones] = useState(initialPortal.milestones);
  const [status, setStatus] = useState(initialPortal.status);
  const [nextWindow, setNextWindow] = useState(initialPortal.nextWindowUtc);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [lastConfirmed, setLastConfirmed] = useState<string | null>(null);

  const handleConfirmMilestone = useCallback(
    async (milestoneId: string) => {
      setPendingId(milestoneId);

      // Optimistic update
      const previousMilestones = [...milestones];
      setMilestones((current) =>
        current.map((m) =>
          m.id === milestoneId
            ? { ...m, status: "COMPLETED" as const, completedTime: "Just now" }
            : m,
        ),
      );

      try {
        const result = await fetchGraphQL<ConfirmHeartbeatMutation>({
          query: ConfirmHeartbeatDocument,
          variables: {
            token: initialPortal.token,
            milestoneId,
          },
        });

        if (result?.confirmIngressHeartbeat) {
          const updated = result.confirmIngressHeartbeat;
          setStatus(updated.status);
          setNextWindow(updated.nextWindowUtc);
          setLastConfirmed(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.warn("[guardian-heartbeat] Ingress confirmation failed, reverting:", err);
        // Revert on error
        setMilestones(previousMilestones);
      } finally {
        setPendingId(null);
      }
    },
    [initialPortal.token, milestones],
  );

  const pendingMilestone = milestones.find(
    (m) => m.status.toUpperCase() === "PENDING" || m.status.toUpperCase() === "OVERDUE",
  );

  return (
    <div className="space-y-6">
      {/* Live Ingress Timeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
                Ingress Checkpoint Timeline
              </h2>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                {status}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Structured progressive check-ins eliminating guesswork and panic · Next window:{" "}
              {nextWindow}
            </p>
          </div>

          {pendingMilestone && (
            <button
              onClick={() => handleConfirmMilestone(pendingMilestone.id)}
              disabled={pendingId !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-display text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {pendingId === pendingMilestone.id ? (
                <>
                  <Icon name="loader" className="size-3.5 animate-spin" />
                  Securing Heartbeat...
                </>
              ) : (
                <>
                  <Icon name="check" className="size-3.5" />
                  Confirm Ingress: {pendingMilestone.label.split(" ")[0]}
                </>
              )}
            </button>
          )}
        </div>

        {lastConfirmed && (
          <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-800 dark:text-emerald-300">
            ✓ Ingress heartbeat acknowledged by Laravel Lighthouse at {lastConfirmed}.
          </div>
        )}

        <div className="mt-6 space-y-4">
          {milestones.map((m, idx) => {
            const isCompleted = m.status.toUpperCase() === "COMPLETED";
            const isPending = m.status.toUpperCase() === "PENDING";
            return (
              <div key={m.id} className="flex items-start gap-4">
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isPending
                        ? "border-2 border-amber-400 bg-amber-400/20 text-amber-800 dark:text-amber-300"
                        : "border-2 border-slate-300 text-slate-400 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-slate-900 dark:text-amber-50">{m.label}</span>
                    <span
                      className={`font-semibold ${
                        isCompleted
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isCompleted
                        ? `Cleared at ${m.completedTime || m.expectedTime}`
                        : `Active Window (${m.expectedTime})`}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {isCompleted
                      ? "Check-in recorded."
                      : "Awaiting arrival ping or manual confirmation."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
