"use client";

import { useState, useMemo } from "react";
import { useStorageVersion } from "@/lib/use-storage-version";
import { Icon } from "@/components/atoms/Icon";
import {
  saveEmergencyBundleOffline,
  isCityCachedOffline,
  OFFLINE_CACHE_UPDATE_EVENT,
  type OfflineEmergencyBundle,
} from "@/lib/offline/emergency-cache";

interface OfflineEmergencyBadgeProps {
  destinationCity: string;
  destinationCountryIso2: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    touristPolice?: string;
    consular24hCrisis?: string;
  };
  survivalPhrases: {
    english: string;
    local: string;
    phonetic: string;
  }[];
}

const OFFLINE_EVENTS = [OFFLINE_CACHE_UPDATE_EVENT] as const;

export function OfflineEmergencyBadge({
  destinationCity,
  destinationCountryIso2,
  emergencyNumbers,
  survivalPhrases,
}: OfflineEmergencyBadgeProps) {
  const [justSaved, setJustSaved] = useState(false);
  const cacheVersion = useStorageVersion(OFFLINE_EVENTS);
  const isCached = useMemo(
    () => cacheVersion >= 0 && isCityCachedOffline(destinationCity),
    [cacheVersion, destinationCity],
  );

  const handleSaveOffline = () => {
    const bundle: OfflineEmergencyBundle = {
      destinationCity,
      destinationCountryIso2,
      cachedAtUtc: new Date().toISOString(),
      emergencyNumbers,
      sanctuaries24h: [
        {
          name: `${destinationCity} Central Tourist Police Station`,
          type: "police_station",
          address: "24/7 Monitored Public Security Station",
        },
        {
          name: `${destinationCity} Main Emergency Hospital`,
          type: "hospital_emergency",
          address: "24/7 Level-1 Trauma Emergency Care",
        },
      ],
      survivalPhrases,
      medicalAlert: {
        bloodType: "A+",
        criticalAllergies: ["Penicillin"],
        criticalMedications: ["Inhaler"],
        emergencyInstructions: "Carry original passport or digital consular pass.",
      },
    };

    const ok = saveEmergencyBundleOffline(bundle);
    if (ok) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3500);
    }
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/70 p-2.5 dark:border-emerald-500/30 dark:bg-emerald-950/20">
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
        <Icon name="shield" className="size-4 text-emerald-600 dark:text-emerald-400" />
        <span>Zero-Data Offline Vault:</span>
      </div>

      {isCached ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 font-mono text-[11px] font-bold text-white shadow-xs">
          <Icon name="check" className="size-3" />
          Cached on Device (Works Offline)
        </span>
      ) : (
        <button
          type="button"
          onClick={handleSaveOffline}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-800 transition-colors hover:bg-emerald-600 hover:text-white dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
        >
          <Icon name="download" className="size-3" />
          Save 1-Tap Offline Cache
        </button>
      )}

      {justSaved && (
        <span className="font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 animate-pulse">
          ✓ Ready for Airplane Mode & Low Battery
        </span>
      )}
    </div>
  );
}
