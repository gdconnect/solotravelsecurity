import { Icon } from "@/components/atoms/Icon";

export interface IngressTimelineProps {
  transitProtocol: string;
  cashStrategy: string;
  contingencyFallback: string;
  destinationCity: string;
  arrivalHour: number;
}

export function IngressTimeline({
  transitProtocol,
  cashStrategy,
  contingencyFallback,
  destinationCity,
  arrivalHour,
}: IngressTimelineProps) {
  const isNight = arrivalHour >= 21 || arrivalHour < 6;

  const steps = [
    {
      time: "T+00",
      title: "Touchdown & Airside Connectivity",
      body: "Keep phone on airplane mode until off the jet bridge. Activate local eSIM data and verify signal before clearing passport control.",
      icon: "phone" as const,
    },
    {
      time: "T+20",
      title: "Airside Cash Triage",
      body: cashStrategy,
      icon: "card" as const,
    },
    {
      time: "T+40",
      title: "Transit Ingress Gate",
      body: transitProtocol,
      icon: "map" as const,
    },
    {
      time: "T+90",
      title: "Contingency & Room Lockdown",
      body: contingencyFallback,
      icon: "hotel" as const,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Zero-Hour Protocol · {destinationCity}
          </span>
          <h3 className="font-display text-lg font-black text-slate-900 dark:text-amber-50">
            The 120-Minute Arrival Timeline
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Icon name="clock" className="size-3.5" />
          Arrival: {String(arrivalHour).padStart(2, "0")}:00 (
          {isNight ? "Night Operation" : "Day Operation"})
        </span>
      </div>

      <ol className="relative mt-6 border-l border-slate-200 pl-6 space-y-6 dark:border-slate-800">
        {steps.map((s, idx) => (
          <li key={idx} className="relative">
            <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-slate-950 dark:border-slate-900">
              <Icon name={s.icon} className="size-3" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400">
                {s.time}
              </span>
              <h4 className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
                {s.title}
              </h4>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
