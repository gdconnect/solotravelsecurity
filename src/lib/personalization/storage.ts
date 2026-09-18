import type {
  TripPlan,
  TravelerPersona,
  TripLifecyclePhase,
  CustomTripChecklistItem,
} from "./types";

export const STORAGE_UPDATE_EVENT = "sts_storage_update";
/** Pass to useStorageVersion to react to persona/trip changes. */
export const STORAGE_EVENTS = [STORAGE_UPDATE_EVENT] as const;

const PERSONA_STORAGE_KEY = "sts_traveler_persona";
const TRIPS_STORAGE_KEY = "sts_traveler_trips";
const ACTIVE_TRIP_KEY = "sts_active_trip_id";

export const DEFAULT_TRAVELER_PERSONA: TravelerPersona = {
  travelerName: "Alex Vance",
  genderIdentity: "female",
  experienceLevel: "occasional",
  archetype: "solo-female",
  citizenship: "US",
  medicalProfile: {
    bloodType: "A-Positive (A+)",
    allergies: ["Penicillin", "Shellfish / Crustaceans"],
    criticalMedications: ["EpiPen Auto-Injector (Carry-on only)"],
    dietaryRestrictions: ["Strict Shellfish Allergy"],
    specialMedicalNotes: "Asthma inhaler in daypack. Wear medical alert bracelet in transit.",
  },
  privacyPreferences: {
    localOnlyStorage: true,
    shareStatusWithGuardian: true,
  },
  financialProfile: {
    cardCount: 2,
    bankCount: 2,
    cardsSegregatedPockets: true,
    backupPhoneAvailable: true,
    hasEmergencyCashReserve: true,
  },
  emergencyContacts: [
    {
      id: "cont-1",
      name: "Sarah Vance",
      relation: "Sister & Primary Contact",
      phone: "+1-415-555-0192",
      email: "sarah.vance@example.com",
      isPrimary: true,
      canAccessGuardianPass: true,
    },
    {
      id: "cont-2",
      name: "Marcus Chen",
      relation: "Partner",
      phone: "+1-212-555-0144",
      email: "marcus.chen@example.com",
      isPrimary: false,
      canAccessGuardianPass: true,
    },
  ],
};

export const DEFAULT_TRIPS: TripPlan[] = [
  {
    id: "trip-tokyo-2026",
    destinationCity: "Tokyo",
    destinationCountry: "Japan",
    destinationCountryIso2: "JP",
    destinationRiskTier: "Low",
    startDate: "2026-09-15",
    endDate: "2026-09-28",
    arrivalHour: 22,
    transitMode: "flight",
    lodgingType: "hotel",
    lodgingFloor: "floors_2_to_4",
    lodgingName: "Hotel Gracery Shinjuku",
    lodgingAddress: "1-19-1 Kabukicho, Shinjuku-ku, Tokyo",
    currentPhase: "in_transit",
    completedChecklistIds: ["CHK-FIN-001", "CHK-PER-001", "CHK-COM-001"],
    completedReminderIds: ["REM-PRE-FIN-01", "REM-PRE-DIG-02"],
    customChecklistItems: [
      {
        id: "c-chk-1",
        title: "Pick up pocket Wi-Fi router at Haneda Terminal 3",
        phase: "in_transit",
        isCompleted: true,
      },
      {
        id: "c-chk-2",
        title: "Confirm hotel 24h reception desk phone line",
        phase: "in_destination",
        isCompleted: false,
      },
    ],
    guardianPassToken: "tokyo",
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-10T14:30:00Z",
  },
  {
    id: "trip-medellin-2026",
    destinationCity: "Medellín",
    destinationCountry: "Colombia",
    destinationCountryIso2: "CO",
    destinationRiskTier: "Elevated",
    startDate: "2026-10-10",
    endDate: "2026-10-24",
    arrivalHour: 14,
    transitMode: "flight",
    lodgingType: "rental_airbnb",
    lodgingFloor: "ground",
    lodgingName: "El Poblado Garden Loft",
    lodgingAddress: "Carrera 37 #8A-12, Medellín, Antioquia",
    currentPhase: "pre_trip",
    completedChecklistIds: ["CHK-FIN-001"],
    completedReminderIds: [],
    customChecklistItems: [
      {
        id: "c-chk-3",
        title: "Pack portable rubber door wedge in carry-on bag",
        phase: "pre_trip",
        isCompleted: true,
      },
    ],
    guardianPassToken: "medellin",
    createdAt: "2026-09-05T12:00:00Z",
    updatedAt: "2026-09-08T09:00:00Z",
  },
];

export function getStoredPersona(): TravelerPersona {
  if (typeof window === "undefined") return DEFAULT_TRAVELER_PERSONA;
  try {
    const raw = localStorage.getItem(PERSONA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TRAVELER_PERSONA;
  } catch {
    return DEFAULT_TRAVELER_PERSONA;
  }
}

export function saveStoredPersona(persona: TravelerPersona): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(persona));
    window.dispatchEvent(new CustomEvent(STORAGE_UPDATE_EVENT));
  } catch {
    // Non-fatal
  }
}

export function getStoredTrips(): TripPlan[] {
  if (typeof window === "undefined") return DEFAULT_TRIPS;
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(DEFAULT_TRIPS));
      return DEFAULT_TRIPS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TRIPS;
  }
}

export function saveStoredTrips(trips: TripPlan[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    window.dispatchEvent(new CustomEvent(STORAGE_UPDATE_EVENT));
  } catch {
    // Non-fatal
  }
}

export function getActiveTripId(): string {
  if (typeof window === "undefined") return DEFAULT_TRIPS[0].id;
  try {
    const active = localStorage.getItem(ACTIVE_TRIP_KEY);
    return active || DEFAULT_TRIPS[0].id;
  } catch {
    return DEFAULT_TRIPS[0].id;
  }
}

export function setActiveTripId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
    window.dispatchEvent(new CustomEvent(STORAGE_UPDATE_EVENT));
  } catch {
    // Non-fatal
  }
}

export function addTrip(trip: TripPlan): void {
  const trips = getStoredTrips();
  trips.unshift(trip);
  saveStoredTrips(trips);
  setActiveTripId(trip.id);
}

export function updateTrip(id: string, updates: Partial<TripPlan>): TripPlan | null {
  const trips = getStoredTrips();
  const index = trips.findIndex((t) => t.id === id);
  if (index === -1) return null;

  trips[index] = {
    ...trips[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveStoredTrips(trips);
  return trips[index];
}

export function deleteTrip(id: string): void {
  const trips = getStoredTrips().filter((t) => t.id !== id);
  saveStoredTrips(trips);
  if (getActiveTripId() === id && trips.length > 0) {
    setActiveTripId(trips[0].id);
  }
}

export function setTripPhase(id: string, phase: TripLifecyclePhase): void {
  updateTrip(id, { currentPhase: phase });
}

export function toggleTripReminder(tripId: string, reminderId: string): void {
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return;

  const completed = new Set(trip.completedReminderIds || []);
  if (completed.has(reminderId)) {
    completed.delete(reminderId);
  } else {
    completed.add(reminderId);
  }

  updateTrip(tripId, { completedReminderIds: Array.from(completed) });
}

export function toggleTripChecklistItem(tripId: string, itemId: string): void {
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return;

  const completed = new Set(trip.completedChecklistIds || []);
  if (completed.has(itemId)) {
    completed.delete(itemId);
  } else {
    completed.add(itemId);
  }

  updateTrip(tripId, { completedChecklistIds: Array.from(completed) });
}

export function addCustomChecklistItem(
  tripId: string,
  title: string,
  phase: TripLifecyclePhase,
): void {
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return;

  const newItem: CustomTripChecklistItem = {
    id: `custom-${Date.now()}`,
    title,
    phase,
    isCompleted: false,
  };

  const existing = trip.customChecklistItems || [];
  updateTrip(tripId, { customChecklistItems: [...existing, newItem] });
}

export function toggleCustomChecklistItem(tripId: string, itemId: string): void {
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip || !trip.customChecklistItems) return;

  const updated = trip.customChecklistItems.map((item) =>
    item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item,
  );

  updateTrip(tripId, { customChecklistItems: updated });
}

export function deleteCustomChecklistItem(tripId: string, itemId: string): void {
  const trips = getStoredTrips();
  const trip = trips.find((t) => t.id === tripId);
  if (!trip || !trip.customChecklistItems) return;

  const updated = trip.customChecklistItems.filter((item) => item.id !== itemId);
  updateTrip(tripId, { customChecklistItems: updated });
}
