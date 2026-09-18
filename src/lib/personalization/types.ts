import type { RiskTier, GenderIdentity, ExperienceLevel } from "@/lib/engine/types";

export type TripLifecyclePhase =
  | "pre_trip" // T-30d to T-24h: Planning, offline maps, checklist staging
  | "in_transit" // T-0 Departure to First 120m Ingress: Flight, taxi verification, arrival protocol
  | "in_destination" // Days 1-N: Daily movement, sunset posture, safe return heartbeat
  | "post_trip"; // Return home: Card skim check, debrief, lessons learned

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  canAccessGuardianPass: boolean;
}

export interface MedicalSafetyProfile {
  bloodType: string;
  allergies: string[];
  criticalMedications: string[];
  dietaryRestrictions: string[];
  specialMedicalNotes: string;
}

export interface PrivacyPreferences {
  localOnlyStorage: boolean;
  shareStatusWithGuardian: boolean;
}

export interface FinancialReadinessStatus {
  cardCount: number;
  bankCount: number;
  cardsSegregatedPockets: boolean;
  backupPhoneAvailable: boolean;
  hasEmergencyCashReserve: boolean;
}

export interface TravelerPersona {
  travelerName: string;
  genderIdentity: GenderIdentity;
  experienceLevel: ExperienceLevel;
  archetype: string;
  citizenship: string; // e.g. "US", "UK", "CA", "AU", "DE", "FR"
  medicalProfile: MedicalSafetyProfile;
  privacyPreferences: PrivacyPreferences;
  financialProfile: FinancialReadinessStatus;
  emergencyContacts: EmergencyContact[];
}

export interface PersonalizedReminder {
  id: string;
  phase: TripLifecyclePhase;
  triggerOffsetLabel: string;
  category: "perimeter" | "financial" | "digital" | "transit" | "health" | "consular";
  priority: "CRITICAL" | "HIGH" | "STANDARD";
  title: string;
  summary: string;
  actionProtocol: string[];
  isCompleted: boolean;
  isSpofGuarded: boolean;
  linkedDecisionTableId?: string;
  linkedTruthTableId?: string;
  calendarOffsetHours?: number;
  isRecurringDaily?: boolean;
}

export interface CustomTripChecklistItem {
  id: string;
  title: string;
  phase: TripLifecyclePhase;
  isCompleted: boolean;
  notes?: string;
}

export interface TripPlan {
  id: string;
  destinationCity: string;
  destinationCountry: string;
  destinationCountryIso2: string;
  destinationRiskTier: RiskTier;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  arrivalHour: number; // 0-23
  transitMode: "flight" | "train" | "bus" | "ferry";
  lodgingType: "hotel" | "hostel_dorm" | "hostel_private" | "rental_airbnb";
  lodgingFloor: "ground" | "floors_2_to_4" | "floors_5_plus" | "unknown";
  lodgingName: string;
  lodgingAddress: string;
  currentPhase: TripLifecyclePhase;
  completedChecklistIds: string[];
  completedReminderIds: string[];
  customChecklistItems?: CustomTripChecklistItem[];
  guardianPassToken: string;
  createdAt: string;
  updatedAt: string;
}
