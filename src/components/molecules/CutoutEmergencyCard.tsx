import { Icon } from "@/components/atoms/Icon";

export interface CutoutEmergencyCardProps {
  destinationCity: string;
  destinationCountry: string;
  policeNumber: string;
  ambulanceNumber: string;
  touristPoliceNumber?: string;
  localPhrases: {
    english: string;
    local: string;
    phonetic: string;
  }[];
}

export function CutoutEmergencyCard({
  destinationCity,
  destinationCountry,
  policeNumber,
  ambulanceNumber,
  touristPoliceNumber,
  localPhrases,
}: CutoutEmergencyCardProps) {
  return (
    <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 shadow-xs dark:border-slate-700 dark:bg-slate-950">
      <div className="absolute -top-3 left-4 bg-white px-2 font-mono text-[9px] font-black uppercase tracking-widest text-slate-600 dark:bg-slate-950 dark:text-slate-400">
        ✂ FOLD OR CUT FOR PASSPORT WALLET
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <span className="font-mono text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Emergency Field Card
          </span>
          <h4 className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
            {destinationCity}, {destinationCountry}
          </h4>
        </div>
        <Icon name="shield" className="size-4 text-amber-700 dark:text-amber-400" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-900">
          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Police Emergency
          </span>
          <span className="font-mono text-base font-black text-slate-950 dark:text-white">
            {policeNumber}
          </span>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-900">
          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Ambulance / Medical
          </span>
          <span className="font-mono text-base font-black text-slate-950 dark:text-white">
            {ambulanceNumber}
          </span>
        </div>

        {touristPoliceNumber && (
          <div className="col-span-2 rounded-lg bg-slate-50 p-2.5 sm:col-span-1 dark:bg-slate-900">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Tourist Police Desk
            </span>
            <span className="font-mono text-sm font-black text-slate-950 dark:text-white">
              {touristPoliceNumber}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Phonetic Survival Phrases
        </span>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {localPhrases.slice(0, 4).map((p, idx) => (
            <div
              key={idx}
              className="rounded-md border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800/60 dark:bg-slate-900/50"
            >
              <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400">
                {p.english}
              </span>
              <span className="block font-mono text-xs font-black text-slate-900 dark:text-amber-100">
                {p.phonetic}
              </span>
              <span className="block text-[10px] text-slate-600 dark:text-slate-400">
                {p.local}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
