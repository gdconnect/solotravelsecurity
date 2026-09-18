import type { MicroZoneDossier } from "@/lib/schemas/lego-blocks";
import { Icon } from "@/components/atoms/Icon";
import { Badge } from "@/components/atoms";

interface MicroZoneCardProps {
  zone: MicroZoneDossier;
}

export function MicroZoneCard({ zone }: MicroZoneCardProps) {
  const isHighNightRisk = zone.nightRiskTier >= 4;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/80 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Micro-Zone Crime Heatmap
            </span>
            <h3 className="font-display text-lg font-black text-slate-900 sm:text-xl dark:text-amber-50">
              {zone.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Day:{" "}
              <strong className="text-emerald-700 dark:text-emerald-400">
                Tier {zone.dayRiskTier}
              </strong>
            </span>
            <span
              className={`rounded-md px-2.5 py-1 font-bold ${
                isHighNightRisk
                  ? "border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                  : "border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              Night: Tier {zone.nightRiskTier}
            </span>
          </div>
        </div>

        {/* Walkability rating bar */}
        <div className="mt-4 flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
            Solo Walkability:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`size-2.5 rounded-full ${
                  star <= zone.soloFemaleWalkabilityRating
                    ? "bg-amber-500"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-amber-200">
            {zone.soloFemaleWalkabilityRating}/5
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Red Flag Corridors vs Safe Thoroughfares */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Corridors to Avoid */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
              <Icon name="alertTriangle" className="size-4" />
              <h4 className="font-mono text-xs font-black uppercase tracking-wider">
                Red-Flag Corridors (Avoid at Night)
              </h4>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {zone.redFlagCorridors.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safe Thoroughfares */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Icon name="check" className="size-4" />
              <h4 className="font-mono text-xs font-black uppercase tracking-wider">
                Safe Thoroughfares (Well-Lit / Patrolled)
              </h4>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {zone.safeThoroughfares.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 24h Safe Havens / Sanctuaries */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
            <Icon name="shield" className="size-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-amber-100">
              24-Hour Emergency Safe Havens (Sanctuaries)
            </h4>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
            If followed, harassed, or feeling unsafe, enter immediately and speak with staff.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {zone.sanctuaries.map((sanctuary, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-2">
                  <Badge tone={sanctuary.type === "police_box" ? "red" : "amber"}>
                    {sanctuary.type.replace(/_/g, " ")}
                  </Badge>
                </div>
                <h5 className="mt-2 font-display text-xs font-bold text-slate-900 dark:text-white">
                  {sanctuary.name}
                </h5>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {sanctuary.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lodging Guidance */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Solo Lodging Recommendation:
            </span>
            <Badge tone={zone.lodgingRecommendation.isRecommendedForSolo ? "green" : "red"}>
              {zone.lodgingRecommendation.isRecommendedForSolo
                ? "Recommended for Solo"
                : "Caution / Not Recommended"}
            </Badge>
          </div>
          <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
            {zone.lodgingRecommendation.warnings}
          </p>
          {zone.lodgingRecommendation.recommendedSubPockets.length > 0 && (
            <div className="mt-2 text-slate-800 dark:text-slate-200">
              <strong className="font-bold text-slate-900 dark:text-white">
                Safer alternative pocket:
              </strong>{" "}
              {zone.lodgingRecommendation.recommendedSubPockets.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
