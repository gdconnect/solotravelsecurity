/**
 * src/lib/offline/emergency-cache.ts
 *
 * Client-Side Zero-Connectivity Emergency Vault & Offline Cache Engine.
 * Implements Truth Table TT-OFFLINE-SURVIVAL-01 and Decision Table DT-OFFLINE-CACHE-01.
 */

export interface OfflineEmergencyBundle {
  destinationCity: string;
  destinationCountryIso2: string;
  cachedAtUtc: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    touristPolice?: string;
    consular24hCrisis?: string;
  };
  sanctuaries24h: {
    name: string;
    type: "police_station" | "hospital_emergency" | "24h_pharmacy" | "hotel_lobby" | "embassy";
    address: string;
    coordinates?: { lat: number; lng: number };
  }[];
  survivalPhrases: {
    english: string;
    local: string;
    phonetic: string;
  }[];
  medicalAlert?: {
    bloodType: string;
    criticalAllergies: string[];
    criticalMedications: string[];
    emergencyInstructions?: string;
  };
}

const OFFLINE_STORAGE_PREFIX = "sts_offline_emergency_";

/**
 * Persists an offline emergency bundle to localStorage for instant zero-latency retrieval.
 */
export function saveEmergencyBundleOffline(bundle: OfflineEmergencyBundle): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${OFFLINE_STORAGE_PREFIX}${bundle.destinationCity.toLowerCase()}`;
    window.localStorage.setItem(key, JSON.stringify(bundle));
    // Also store as active emergency destination
    window.localStorage.setItem(
      "sts_active_offline_destination",
      bundle.destinationCity.toLowerCase(),
    );
    return true;
  } catch (err) {
    console.error("[OfflineCache] Failed to save offline bundle:", err);
    return false;
  }
}

/**
 * Retrieves the cached offline emergency bundle for a destination.
 */
export function getEmergencyBundleOffline(destinationCity?: string): OfflineEmergencyBundle | null {
  if (typeof window === "undefined") return null;
  try {
    const city = destinationCity
      ? destinationCity.toLowerCase()
      : window.localStorage.getItem("sts_active_offline_destination");

    if (!city) return null;
    const raw = window.localStorage.getItem(`${OFFLINE_STORAGE_PREFIX}${city}`);
    if (!raw) return null;
    return JSON.parse(raw) as OfflineEmergencyBundle;
  } catch (err) {
    console.error("[OfflineCache] Failed to read offline bundle:", err);
    return null;
  }
}

/**
 * Checks if offline emergency data exists for a specific city.
 */
export function isCityCachedOffline(destinationCity: string): boolean {
  if (typeof window === "undefined") return false;
  const key = `${OFFLINE_STORAGE_PREFIX}${destinationCity.toLowerCase()}`;
  return !!window.localStorage.getItem(key);
}
