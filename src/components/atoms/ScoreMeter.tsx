export interface ScoreMeterProps {
  score: number;
  grade: "A" | "B" | "C" | "D";
  size?: "sm" | "md" | "lg";
}

export function ScoreMeter({ score, grade, size = "md" }: ScoreMeterProps) {
  // Clamped 0-100
  const clampedScore = Math.max(0, Math.min(100, score));

  // Determine color tone
  let strokeColor = "#10b981"; // green
  let gradeBg =
    "bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300";
  let ratingLabel = "Fortified & Calm";

  if (clampedScore < 55) {
    strokeColor = "#f43f5e"; // rose/crimson
    gradeBg =
      "bg-rose-500/10 text-rose-800 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300";
    ratingLabel = "High Exposure / Action Required";
  } else if (clampedScore < 75) {
    strokeColor = "#f97316"; // orange
    gradeBg =
      "bg-orange-500/10 text-orange-800 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-300";
    ratingLabel = "Vulnerable to Cascades";
  } else if (clampedScore < 90) {
    strokeColor = "#f59e0b"; // amber
    gradeBg =
      "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300";
    ratingLabel = "Solid Operational Base";
  }

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-36 h-36",
    lg: "w-48 h-48",
  }[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative flex items-center justify-center ${sizeClasses}`}>
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-800"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-3xl font-black text-slate-900 dark:text-amber-50">
            {clampedScore}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            / 100
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-mono text-xs font-black tracking-wider uppercase ${gradeBg}`}
        >
          Grade {grade} · {ratingLabel}
        </span>
      </div>
    </div>
  );
}
