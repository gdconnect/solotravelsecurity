"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { ScoreMeter, Badge } from "@/components/atoms";
import type {
  TripPlan,
  TravelerPersona,
  TripLifecyclePhase,
  PersonalizedReminder,
} from "@/lib/personalization/types";
import {
  getStoredPersona,
  getStoredTrips,
  getActiveTripId,
  setActiveTripId,
  addTrip,
  deleteTrip,
  toggleTripReminder,
  toggleTripChecklistItem,
  addCustomChecklistItem,
  toggleCustomChecklistItem,
  deleteCustomChecklistItem,
  setTripPhase,
  DEFAULT_TRIPS,
  DEFAULT_TRAVELER_PERSONA,
} from "@/lib/personalization/storage";
import { generatePersonalizedReminders } from "@/lib/personalization/reminders-engine";
import { generateTripIcs } from "@/lib/personalization/calendar-export";
import { getMedicalTranslations } from "@/lib/personalization/medical-translator";
import { evaluateProductsForSituation } from "@/data/gear/matcher";
import type { SituationalContext } from "@/data/gear/types";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";
import { getCountryByIso2 } from "@/data/geo/countries";
import { generateSituationalChecklist } from "@/lib/engine/checklist-generator";
import { PrintableEmergencyPacket } from "@/components/organisms/PrintableEmergencyPacket";
import { generatePreTripBriefingEmail } from "@/lib/personalization/email-templates";
import { useFavorites, exportFavoritesJson } from "@/lib/favorites";

const PHASES: Array<{
  id: TripLifecyclePhase;
  label: string;
  tagline: string;
  badge: string;
}> = [
  {
    id: "pre_trip",
    label: "1. Pre-Trip Preparation",
    tagline: "T-30d to T-24h · Inoculation & Staging",
    badge: "Prep Window",
  },
  {
    id: "in_transit",
    label: "2. Ingress & First 120m",
    tagline: "T-0 to Touchdown · Peak Exposure Gate",
    badge: "Arrival Gate",
  },
  {
    id: "in_destination",
    label: "3. In-Destination Daily",
    tagline: "Days 1-N · Perimeter & Sunset Protocol",
    badge: "Daily Ops",
  },
  {
    id: "post_trip",
    label: "4. Post-Trip Egress",
    tagline: "Return Home · Skim Audit & Debrief",
    badge: "Debrief",
  },
];

export function TravelerPortalClient() {
  const [trips, setTrips] = useState<TripPlan[]>(DEFAULT_TRIPS);
  const [activeTripId, setActiveTripIdState] = useState<string>(DEFAULT_TRIPS[0].id);
  const [persona, setPersona] = useState<TravelerPersona>(DEFAULT_TRAVELER_PERSONA);
  const [activeTab, setActiveTab] = useState<
    | "checklists"
    | "reminders"
    | "recommendations"
    | "emergency"
    | "guardian"
    | "printables"
    | "email"
    | "favorites"
  >("checklists");
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [favoritesFilter, setFavoritesFilter] = useState<string>("all");

  // Custom Checklist Item creation state
  const [newCustomTitle, setNewCustomTitle] = useState<string>("");
  const [newCustomPhase, setNewCustomPhase] = useState<TripLifecyclePhase>("pre_trip");

  // New Trip Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCity, setNewCity] = useState<string>("Bangkok");
  const [newCountry, setNewCountry] = useState<string>("Thailand");
  const [newIso2, setNewIso2] = useState<string>("TH");
  const [newRisk, setNewRisk] = useState<"Low" | "Moderate" | "Elevated" | "High">("Moderate");
  const [newStart, setNewStart] = useState<string>("2026-11-01");
  const [newEnd, setNewEnd] = useState<string>("2026-11-15");
  const [newHour, setNewHour] = useState<number>(21);
  const [newLodgingType, setNewLodgingType] = useState<
    "hotel" | "hostel_dorm" | "hostel_private" | "rental_airbnb"
  >("hotel");
  const [newLodgingFloor, setNewLodgingFloor] = useState<
    "ground" | "floors_2_to_4" | "floors_5_plus"
  >("floors_2_to_4");
  const [newLodgingName, setNewLodgingName] = useState<string>("Sukhumvit Riverside Hotel");

  // ICS notification banner
  const [calendarExported, setCalendarExported] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    setTrips(getStoredTrips());
    setActiveTripIdState(getActiveTripId());
    setPersona(getStoredPersona());

    const handleStorageUpdate = () => {
      setTrips(getStoredTrips());
      setActiveTripIdState(getActiveTripId());
      setPersona(getStoredPersona());
    };

    window.addEventListener("sts_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("sts_storage_update", handleStorageUpdate);
  }, []);

  const activeTrip: TripPlan = useMemo(() => {
    return trips.find((t) => t.id === activeTripId) || trips[0] || DEFAULT_TRIPS[0];
  }, [trips, activeTripId]);

  const destProfile = useMemo(() => {
    return (
      getDestinationBySlug(activeTrip.destinationCity.toLowerCase()) ||
      TOP_SOLO_DESTINATIONS.find(
        (d) => d.name.toLowerCase() === activeTrip.destinationCity.toLowerCase(),
      ) ||
      TOP_SOLO_DESTINATIONS[0]
    );
  }, [activeTrip.destinationCity]);

  const countryData = useMemo(() => {
    return getCountryByIso2(activeTrip.destinationCountryIso2);
  }, [activeTrip.destinationCountryIso2]);

  // Generate personalized reminders
  const reminders: PersonalizedReminder[] = useMemo(() => {
    return generatePersonalizedReminders(activeTrip, persona);
  }, [activeTrip, persona]);

  // Filtered reminders for active phase
  const phaseReminders = useMemo(() => {
    return reminders.filter((r) => r.phase === activeTrip.currentPhase);
  }, [reminders, activeTrip.currentPhase]);

  // Generate situational checklist
  const checklist = useMemo(() => {
    return generateSituationalChecklist({
      archetype: persona.archetype,
      destinationRiskTier: activeTrip.destinationRiskTier.toUpperCase() as any,
    });
  }, [persona.archetype, activeTrip.destinationRiskTier]);

  // Matched polymorphic products
  const matchedProducts = useMemo(() => {
    const context: SituationalContext = {
      trip: {
        destinationCity: activeTrip.destinationCity,
        destinationCountry: activeTrip.destinationCountry,
        destinationCountryIso2: activeTrip.destinationCountryIso2,
        destinationRiskTier: activeTrip.destinationRiskTier,
        arrivalHour: activeTrip.arrivalHour,
        transitMode: activeTrip.transitMode,
        lodgingType: activeTrip.lodgingType,
        lodgingFloor: activeTrip.lodgingFloor,
      },
      profile: {
        genderIdentity: persona.genderIdentity,
        experienceLevel: persona.experienceLevel,
        gearValueTier: "moderate_laptop_phone",
        cellularType: "esim_preloaded",
        cardsSegregatedPockets: persona.financialProfile.cardsSegregatedPockets,
        backupPhoneAvailable: persona.financialProfile.backupPhoneAvailable,
        hasEmergencyCashReserve: persona.financialProfile.hasEmergencyCashReserve,
      },
    };
    return evaluateProductsForSituation(context);
  }, [activeTrip, persona]);

  // Emergency medical translations
  const medicalTranslations = useMemo(() => {
    return getMedicalTranslations(destProfile.primaryLanguage || "English");
  }, [destProfile.primaryLanguage]);

  // Readiness Score calculation with SPOF immunity gates
  const scoring = useMemo(() => {
    const total = reminders.length;
    if (total === 0) return { score: 100, grade: "A" as const, unverifiedSpofs: [] };

    const unverifiedSpofs: string[] = [];
    let completedCount = 0;

    for (const r of reminders) {
      const isDone = activeTrip.completedReminderIds?.includes(r.id);
      if (isDone) {
        completedCount++;
      } else if (r.isSpofGuarded) {
        unverifiedSpofs.push(r.title);
      }
    }

    let rawScore = Math.round((completedCount / total) * 100);

    // Enforce SPOF ceiling: capped at 49 (Grade D) if any SPOF is unresolved
    if (unverifiedSpofs.length > 0 && rawScore > 49) {
      rawScore = 49;
    }

    const grade =
      rawScore >= 90
        ? ("A" as const)
        : rawScore >= 75
          ? ("B" as const)
          : rawScore >= 55
            ? ("C" as const)
            : ("D" as const);

    return {
      score: rawScore,
      grade,
      unverifiedSpofs,
    };
  }, [reminders, activeTrip.completedReminderIds]);

  // Handle phase change
  const handlePhaseChange = (phase: TripLifecyclePhase) => {
    setTripPhase(activeTrip.id, phase);
  };

  // Handle reminder toggle
  const handleToggleReminder = (reminderId: string) => {
    toggleTripReminder(activeTrip.id, reminderId);
  };

  // Export RFC 5545 iCalendar (.ics)
  const handleExportCalendar = () => {
    const icsContent = generateTripIcs(activeTrip, reminders);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `security-schedule-${activeTrip.destinationCity.toLowerCase()}-${activeTrip.id}.ics`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCalendarExported(true);
    setTimeout(() => setCalendarExported(false), 5000);
  };

  // Handle custom checklist actions
  const handleAddCustomChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTitle.trim()) return;
    addCustomChecklistItem(activeTrip.id, newCustomTitle.trim(), newCustomPhase);
    setNewCustomTitle("");
  };

  const handleToggleCustomChecklist = (itemId: string) => {
    toggleCustomChecklistItem(activeTrip.id, itemId);
  };

  const handleDeleteCustomChecklist = (itemId: string) => {
    deleteCustomChecklistItem(activeTrip.id, itemId);
  };

  const handleToggleChecklist = (itemId: string) => {
    toggleTripChecklistItem(activeTrip.id, itemId);
  };

  // Handle trip creation
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const newTripObj: TripPlan = {
      id: `trip-${newCity.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      destinationCity: newCity,
      destinationCountry: newCountry,
      destinationCountryIso2: newIso2,
      destinationRiskTier: newRisk,
      startDate: newStart,
      endDate: newEnd,
      arrivalHour: newHour,
      transitMode: "flight",
      lodgingType: newLodgingType,
      lodgingFloor: newLodgingFloor,
      lodgingName: newLodgingName,
      lodgingAddress: `${newCity} Center`,
      currentPhase: "pre_trip",
      completedChecklistIds: [],
      completedReminderIds: [],
      guardianPassToken: newCity.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTrip(newTripObj);
    setIsModalOpen(false);
  };

  const emergencyPolice =
    destProfile.emergencyNumbers.generalOrPolice || countryData?.emergencyNumbers.police || "112";
  const emergencyAmbulance =
    destProfile.emergencyNumbers.ambulance || countryData?.emergencyNumbers.ambulance || "112";
  const emergencyTouristPolice =
    destProfile.emergencyNumbers.touristPolice || countryData?.emergencyNumbers.touristPolice;
  const consularHotline = countryData?.consularHotlines.usEmbassyPhone || "+1-202-501-4444";

  return (
    <div className="space-y-8">
      {/* TOP COMMAND HEADER: Trip Selector, Phase Badge, Calendar Export */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="amber">
                <Icon name="shield" className="size-3" />
                Solo Traveler Private Command
              </Badge>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                Client-Side Encrypted · Zero Cloud Logs
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label htmlFor="active-trip-select" className="sr-only">
                Select Active Trip
              </label>
              <select
                id="active-trip-select"
                value={activeTrip.id}
                onChange={(e) => setActiveTripId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-display text-lg font-black text-slate-900 shadow-xs focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-amber-50"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    📍 {t.destinationCity}, {t.destinationCountry} ({t.startDate})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-display text-xs font-bold text-slate-700 shadow-xs transition hover:border-amber-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <Icon name="plus" className="size-3.5 text-amber-500" />
                <span>New Trip</span>
              </button>

              {trips.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteTrip(activeTrip.id)}
                  title="Delete this trip"
                  className="rounded-xl border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50 dark:border-rose-950 dark:hover:bg-rose-950/30"
                >
                  <Icon name="trash" className="size-3.5" />
                </button>
              )}
            </div>

            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Lodging: <strong>{activeTrip.lodgingName || "Confirmed Lodging"}</strong> · Arrival:{" "}
              <strong>{String(activeTrip.arrivalHour).padStart(2, "0")}:00</strong> · Risk Tier:{" "}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {activeTrip.destinationRiskTier}
              </span>
            </p>
          </div>

          {/* Quick Metrics: Readiness Score & Calendar Sync */}
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-950">
              <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Readiness Inoculation
              </span>
              <div className="mt-1">
                <ScoreMeter score={scoring.score} grade={scoring.grade} size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              <button
                type="button"
                onClick={handleExportCalendar}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-3.5 py-2 font-display text-xs font-black text-slate-950 shadow-xs transition hover:bg-amber-300"
              >
                <Icon name="calendar" className="size-3.5" />
                <span>Sync .ics Alarms</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("printables")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-display text-xs font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Icon name="download" className="size-3.5 text-amber-500" />
                <span>Print Packet (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-display text-xs font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Icon name="mail" className="size-3.5 text-amber-500" />
                <span>Email Briefing</span>
              </button>

              <Link
                href={`/guardian/${activeTrip.guardianPassToken || "tokyo"}`}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-display text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <Icon name="share" className="size-3.5 text-amber-500" />
                <span>Guardian Pass</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Calendar exported confirmation banner */}
        {calendarExported && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-800 dark:text-emerald-300">
            <Icon name="check" className="size-4 shrink-0 text-emerald-600" />
            <span>
              RFC 5545 iCalendar file downloaded! Import into Apple Calendar or Google Calendar for
              automated arrival alarms and security protocol reminders.
            </span>
          </div>
        )}

        {/* Single Point of Failure (SPOF) Alert Banner */}
        {scoring.unverifiedSpofs.length > 0 && (
          <div className="mt-4 rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 p-4 dark:border-rose-500/40 dark:bg-rose-950/30">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-rose-600 p-1.5 text-white">
                <Icon name="shieldAlert" className="size-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
                  Single Point of Failure (SPOF) Immunity Gate Active
                </h4>
                <p className="text-xs leading-relaxed text-rose-900 dark:text-rose-200">
                  Your readiness score is capped at <strong>49/100 (Grade D)</strong> because{" "}
                  <strong>{scoring.unverifiedSpofs.length}</strong> critical protocol(s) are
                  unverified. A single payment failure or uninspected night transit can cause
                  catastrophic exposure.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  {scoring.unverifiedSpofs.map((spof, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-rose-500/30 bg-white/70 px-2 py-0.5 text-rose-800 dark:bg-slate-900/70 dark:text-rose-300"
                    >
                      ⚠️ {spof}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRIP LIFECYCLE PHASE STEPPER */}
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Trip Lifecycle Progression
          </span>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PHASES.map((ph) => {
              const isActive = activeTrip.currentPhase === ph.id;
              return (
                <button
                  type="button"
                  key={ph.id}
                  onClick={() => handlePhaseChange(ph.id)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-amber-400 bg-amber-400/10 shadow-sm dark:bg-amber-400/5 ring-2 ring-amber-400/40"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-black uppercase ${
                        isActive
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {ph.badge}
                    </span>
                    {isActive && (
                      <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </div>

                  <div className="mt-3">
                    <h5
                      className={`font-display text-sm font-bold ${
                        isActive
                          ? "text-amber-800 dark:text-amber-300"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {ph.label}
                    </h5>
                    <p className="mt-1 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                      {ph.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PORTAL WORKSPACE TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav aria-label="Portal tabs" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("checklists")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "checklists"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="check" className="size-4" />
            <span>Trip Checklists</span>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono text-[10px] text-amber-800 dark:text-amber-300 font-bold">
              {(activeTrip.completedChecklistIds?.length || 0) +
                (activeTrip.customChecklistItems?.filter((i) => i.isCompleted).length || 0)}
              /{checklist.items.length + (activeTrip.customChecklistItems?.length || 0)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reminders")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "reminders"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="bell" className="size-4" />
            <span>Smart Reminders</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] dark:bg-slate-800">
              {phaseReminders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("recommendations")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "recommendations"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="zap" className="size-4" />
            <span>Curated Gear & Products</span>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-mono text-[10px] text-amber-800 dark:text-amber-300">
              {matchedProducts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("emergency")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "emergency"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="shield" className="size-4" />
            <span>Emergency Protocols</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guardian")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "guardian"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="shield" className="size-4" />
            <span>Family Guardian Pass</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("printables")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "printables"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="download" className="size-4" />
            <span>Printables (Lifejacket)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "email"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="mail" className="size-4" />
            <span>Email Briefing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`inline-flex items-center gap-2 rounded-t-xl px-4 py-3 font-display text-xs font-bold transition border-b-2 ${
              activeTab === "favorites"
                ? "border-amber-400 text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon name="heart" className="size-4 text-rose-500" />
            <span>Saved Kit</span>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-rose-600 dark:text-rose-400 font-bold">
              {favorites.length}
            </span>
          </button>
        </nav>
      </div>

      {/* TAB CONTENT 1: SMART REMINDERS DECK */}
      {activeTab === "reminders" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-black text-slate-900 dark:text-amber-50">
                Active Ingress Directives ({activeTrip.currentPhase.replace("_", " ").toUpperCase()}
                )
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Time-triggered situational protocols designed to prevent transition failure.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCalendar}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-display text-xs font-bold text-slate-700 shadow-xs hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Icon name="download" className="size-3.5" />
              <span>Download .ics Schedule</span>
            </button>
          </div>

          <div className="grid gap-4">
            {phaseReminders.map((rem) => {
              const isDone = activeTrip.completedReminderIds?.includes(rem.id);

              return (
                <div
                  key={rem.id}
                  className={`rounded-2xl border p-5 transition ${
                    isDone
                      ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                      : rem.priority === "CRITICAL"
                        ? "border-rose-500/30 bg-white dark:border-rose-500/40 dark:bg-slate-900"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleReminder(rem.id)}
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                          isDone
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 hover:border-amber-400 dark:border-slate-700"
                        }`}
                        aria-label={`Mark ${rem.title} as ${isDone ? "pending" : "completed"}`}
                      >
                        {isDone && <Icon name="check" className="size-3.5" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              rem.priority === "CRITICAL"
                                ? "bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/30"
                                : "bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-400/30"
                            }`}
                          >
                            {rem.triggerOffsetLabel}
                          </span>

                          {rem.isSpofGuarded && (
                            <span className="font-mono text-[9px] font-bold text-rose-800 dark:text-rose-300">
                              🛡️ SPOF Guarded
                            </span>
                          )}

                          {rem.isRecurringDaily && (
                            <span className="font-mono text-[9px] font-medium text-slate-500">
                              🔄 Recurring Daily
                            </span>
                          )}
                        </div>

                        <h4
                          className={`font-display text-base font-black ${
                            isDone
                              ? "text-slate-500 line-through dark:text-slate-400"
                              : "text-slate-900 dark:text-amber-50"
                          }`}
                        >
                          {rem.title}
                        </h4>

                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {rem.summary}
                        </p>

                        {/* Action Steps */}
                        <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-950">
                          <span className="block font-mono text-[10px] font-bold uppercase text-slate-500">
                            Protocol Action Steps:
                          </span>
                          <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                            {rem.actionProtocol.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  {idx + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Linked Decision/Truth Tables */}
                        {(rem.linkedDecisionTableId || rem.linkedTruthTableId) && (
                          <div className="mt-3 flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
                            {rem.linkedDecisionTableId && (
                              <Link
                                href="/playbook/decision-matrices/"
                                className="inline-flex items-center gap-1 text-amber-700 hover:underline dark:text-amber-400"
                              >
                                <Icon name="table" className="size-3" />
                                <span>Rule Table: {rem.linkedDecisionTableId} →</span>
                              </Link>
                            )}
                            {rem.linkedTruthTableId && (
                              <Link
                                href="/playbook/decision-matrices/"
                                className="inline-flex items-center gap-1 text-rose-700 hover:underline dark:text-rose-400"
                              >
                                <Icon name="shieldAlert" className="size-3" />
                                <span>Truth Proof: {rem.linkedTruthTableId} →</span>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold transition ${
                        isDone
                          ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs"
                      }`}
                    >
                      {isDone ? "Completed" : "Verify Step"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 1: PROCEDURAL CHECKLISTS & CUSTOM TRIP ITEMS */}
      {activeTab === "checklists" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-black text-slate-900 dark:text-amber-50">
                Trip Security Checklists & Progress
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Manage your operational safeguards for {activeTrip.destinationCity}. Check off items
                as you verify them, or add custom checklist tasks for this specific trip.
              </p>
            </div>

            <Link
              href="/playbook/checklists/"
              className="inline-flex items-center gap-1 font-display text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
            >
              <span>Full Master Catalog ({checklist.totalItems} items) →</span>
            </Link>
          </div>

          {/* Privacy Notice Banner */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <span className="font-mono text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 block">
              🛡️ Privacy-First Operational Storage
            </span>
            <span>
              SoloTravelSecurity stores only operational checklists, reminders, and trip parameters.
              We <strong>never</strong> ask for, accept, or store passport numbers, payment card
              credentials, or bank accounts.
            </span>
          </div>

          {/* Inline Form to Add Custom Checklist Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-amber-50">
              Add Custom Checklist Task
            </h4>
            <form onSubmit={handleAddCustomChecklist} className="mt-3 flex flex-wrap gap-3">
              <input
                type="text"
                required
                placeholder="e.g. Pick up Japan Rail Pass voucher at station..."
                value={newCustomTitle}
                onChange={(e) => setNewCustomTitle(e.target.value)}
                className="min-w-[280px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <select
                value={newCustomPhase}
                onChange={(e) => setNewCustomPhase(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="pre_trip">Pre-Trip Staging</option>
                <option value="in_transit">In-Transit / Arrival</option>
                <option value="in_destination">In-Destination Daily</option>
                <option value="post_trip">Post-Trip Return</option>
              </select>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-black text-slate-950 hover:bg-amber-300 shadow-xs"
              >
                <Icon name="plus" className="size-3.5" />
                <span>Add Task</span>
              </button>
            </form>
          </div>

          {/* Custom Trip Checklist Items List */}
          {activeTrip.customChecklistItems && activeTrip.customChecklistItems.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500">
                Your Custom Tasks ({activeTrip.customChecklistItems.length})
              </span>
              <div className="grid gap-2">
                {activeTrip.customChecklistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition ${
                      item.isCompleted
                        ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleCustomChecklist(item.id)}
                        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                          item.isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 hover:border-amber-400 dark:border-slate-700"
                        }`}
                        aria-label={`Mark ${item.title} as ${item.isCompleted ? "pending" : "completed"}`}
                      >
                        {item.isCompleted && <Icon name="check" className="size-3.5" />}
                      </button>

                      <div>
                        <span
                          className={`text-xs font-bold ${
                            item.isCompleted
                              ? "text-slate-500 line-through dark:text-slate-400"
                              : "text-slate-900 dark:text-amber-50"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="ml-2 font-mono text-[9px] uppercase text-amber-700 dark:text-amber-400">
                          [{item.phase.replace("_", " ")}]
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomChecklist(item.id)}
                      className="rounded-lg p-1 text-slate-400 hover:text-rose-500"
                      title="Delete task"
                    >
                      <Icon name="trash" className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canonical Procedural Checklist Items */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-500">
              Standard Security Protocols ({checklist.items.length})
            </span>

            <div className="grid gap-3">
              {checklist.items.map((item) => {
                const isDone = activeTrip.completedChecklistIds?.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between gap-4 rounded-xl border p-4 shadow-xs transition ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(item.id)}
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                          isDone
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 hover:border-amber-400 dark:border-slate-700"
                        }`}
                        aria-label={`Mark ${item.title} as ${isDone ? "pending" : "completed"}`}
                      >
                        {isDone && <Icon name="check" className="size-3.5" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase">
                            {item.pillarId}
                          </span>
                          {item.isSPOF && (
                            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-800 dark:text-rose-300">
                              🛡️ SPOF
                            </span>
                          )}
                          <span className="font-mono text-[9px] text-amber-600 dark:text-amber-400">
                            Deduction: -{item.scoringDeductionPoints} pts
                          </span>
                        </div>
                        <h5
                          className={`font-display text-sm font-bold ${
                            isDone
                              ? "text-slate-500 line-through dark:text-slate-400"
                              : "text-slate-900 dark:text-amber-50"
                          }`}
                        >
                          {item.title}
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(item.id)}
                        className={`rounded-lg px-2.5 py-1 font-mono text-[10px] font-bold transition ${
                          isDone
                            ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-700 hover:bg-amber-400 hover:text-slate-950 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isDone ? "Verified" : "Verify"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PERSONALIZED PRODUCTS & SERVICES */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl font-black text-slate-900 dark:text-amber-50">
              Curated Security Tools & Situational Gear
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Matched strictly to {activeTrip.destinationCity}, {activeTrip.lodgingType} (floor:{" "}
              {activeTrip.lodgingFloor}), and {activeTrip.destinationRiskTier} risk tier.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedProducts.map((prod) => (
              <div
                key={prod.sku}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-black uppercase text-amber-700 dark:text-amber-400">
                      {prod.category.replace("_", " ")}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {prod.schemaOrg.priceCurrency} {prod.schemaOrg.price}
                    </span>
                  </div>

                  <h4 className="mt-2 font-display text-base font-black text-slate-900 dark:text-amber-50">
                    {prod.name}
                  </h4>

                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {prod.situationalRationale}
                  </p>

                  <div className="mt-3 space-y-1 font-mono text-[10px] text-slate-500">
                    {prod.schemaOrg.pros.slice(0, 2).map((pro, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400"
                      >
                        <Icon name="check" className="size-3" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">
                    Brand: {prod.schemaOrg.brand}
                  </span>
                  <a
                    href={prod.schemaOrg.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 font-display text-xs font-black text-slate-950 hover:bg-amber-300"
                  >
                    <span>Inspect</span>
                    <Icon name="externalLink" className="size-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: EMERGENCY DISPATCH & MEDICAL PROTOCOLS */}
      {activeTab === "emergency" && (
        <div className="space-y-8">
          {/* Strict Zero-PII Policy Reassurance Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-400 p-2 text-slate-950 shrink-0">
                <Icon name="shield" className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-black text-slate-900 dark:text-amber-50">
                  Zero-PII & Financial Privacy Commitment
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  SoloTravelSecurity is strictly an operational security and procedural checklist
                  platform. We <strong>never request, accept, or store</strong> passport scans,
                  payment card numbers, bank credentials, or private identity documents. All trip
                  configurations and checklist progress are stored locally on your device.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Emergency Medical Statements Translated into Destination Language */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                    Medical Translation Card
                  </span>
                  <h4 className="mt-1 font-display text-lg font-black text-slate-900 dark:text-amber-50">
                    {destProfile.primaryLanguage} Medical Statements
                  </h4>
                </div>
                <span className="rounded-md bg-rose-500 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                  Offline Flashcard
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {medicalTranslations.map((med, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                      {med.english}
                    </span>
                    <div className="mt-1 font-display text-sm font-black text-slate-900 dark:text-amber-50">
                      {med.translated}
                    </div>
                    {med.phonetic && (
                      <div className="mt-1 font-mono text-[11px] text-amber-700 dark:text-amber-400">
                        Pronunciation: &ldquo;{med.phonetic}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts & Consular Hotlines */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <span className="font-mono text-[10px] font-bold uppercase text-slate-500">
                  Designated Emergency Contacts
                </span>
                <h4 className="mt-1 font-display text-lg font-black text-slate-900 dark:text-amber-50">
                  Primary Check-In Responders
                </h4>

                <div className="mt-4 space-y-3">
                  {persona.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
                            {contact.name}
                          </span>
                          {contact.isPrimary && (
                            <span className="rounded bg-amber-400 px-1.5 py-0.2 font-mono text-[8px] font-black text-slate-950 uppercase">
                              Primary
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">
                          {contact.relation}
                        </span>
                      </div>

                      <a
                        href={`tel:${contact.phone}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 font-mono text-xs font-bold text-slate-950 hover:bg-amber-300"
                      >
                        <Icon name="phone" className="size-3" />
                        <span>{contact.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Emergency Dispatch Numbers */}
              <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-6 dark:border-rose-500/40">
                <span className="font-mono text-[10px] font-black uppercase text-rose-800 dark:text-rose-300">
                  Immediate Rescue Hotline: {activeTrip.destinationCity}
                </span>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a
                    href={`tel:${emergencyPolice}`}
                    className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                  >
                    <div>
                      <span className="block font-mono text-[9px] text-slate-500 uppercase">
                        Police
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {emergencyPolice}
                      </span>
                    </div>
                    <Icon name="phone" className="size-4 text-rose-500" />
                  </a>

                  <a
                    href={`tel:${emergencyAmbulance}`}
                    className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                  >
                    <div>
                      <span className="block font-mono text-[9px] text-slate-500 uppercase">
                        Ambulance
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {emergencyAmbulance}
                      </span>
                    </div>
                    <Icon name="phone" className="size-4 text-emerald-500" />
                  </a>

                  {emergencyTouristPolice && (
                    <a
                      href={`tel:${emergencyTouristPolice}`}
                      className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                    >
                      <div>
                        <span className="block font-mono text-[9px] text-slate-500 uppercase">
                          Tourist Police
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {emergencyTouristPolice}
                        </span>
                      </div>
                      <Icon name="phone" className="size-4 text-amber-500" />
                    </a>
                  )}

                  <a
                    href={`tel:${consularHotline}`}
                    className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                  >
                    <div>
                      <span className="block font-mono text-[9px] text-slate-500 uppercase">
                        Consular Desk
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {consularHotline}
                      </span>
                    </div>
                    <Icon name="globe" className="size-4 text-sky-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: THE GUARDIAN PASS */}
      {activeTab === "guardian" && (
        <div className="rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 dark:border-amber-400/30">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-black uppercase text-slate-950">
                  Family Peace of Mind
                </span>
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                  Zero-Panic Parental Ingress Link
                </span>
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-amber-50">
                Share Verified Ingress Milestones Without Invasive GPS Tracking
              </h3>
              <p className="max-w-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Give parents or emergency contacts a private, read-only link that displays your
                flight touchdown verification, transit ingress status, lodging check-in
                confirmation, and emergency embassy dispatch lines. Preserves your full travel
                independence while eliminating frantic middle-of-the-night phone calls.
              </p>
            </div>

            <div className="shrink-0 space-y-2">
              <Link
                href={`/guardian/${activeTrip.guardianPassToken || "tokyo"}`}
                target="_blank"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-display text-xs font-black text-slate-950 transition hover:bg-amber-300 shadow-sm"
              >
                <span>Open Live Guardian View</span>
                <Icon name="arrowRight" className="size-3.5" />
              </Link>
              <span className="block text-center font-mono text-[10px] text-slate-500">
                Pass ID: GRD-{activeTrip.guardianPassToken?.toUpperCase() || "TOKYO"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: PRINTABLES (OFFLINE LIFEJACKET) */}
      {activeTab === "printables" && (
        <PrintableEmergencyPacket trip={activeTrip} persona={persona} />
      )}

      {/* TAB CONTENT 7: PRE-TRIP EMAIL BRIEFING */}
      {activeTab === "email" &&
        (() => {
          const briefing = generatePreTripBriefingEmail(activeTrip, persona);
          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-black text-slate-900 dark:text-amber-50">
                    Pre-Trip Safety Briefing Email Dispatch
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Send this standardized briefing to family or emergency contacts before departure
                    to establish the agreed check-in protocol and escalation ladder.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(briefing.textBody);
                        setEmailCopied(true);
                        setTimeout(() => setEmailCopied(false), 3000);
                      } catch {
                        // Fallback
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-display text-xs font-bold text-slate-700 shadow-xs hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Icon name="fileText" className="size-3.5 text-amber-500" />
                    <span>{emailCopied ? "Copied to Clipboard!" : "Copy Email Body"}</span>
                  </button>

                  <a
                    href={briefing.mailtoUrl}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 font-display text-xs font-black text-slate-950 shadow-xs hover:bg-amber-300"
                  >
                    <Icon name="mail" className="size-3.5" />
                    <span>Open in Email App</span>
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 pb-4 font-mono text-xs dark:border-slate-800 space-y-1">
                  <div>
                    <span className="text-slate-500">To: </span>
                    <strong className="text-slate-900 dark:text-white">
                      {persona.emergencyContacts[0]?.email || "primary.contact@example.com"}
                    </strong>{" "}
                    ({persona.emergencyContacts[0]?.name})
                  </div>
                  <div>
                    <span className="text-slate-500">Subject: </span>
                    <strong className="text-slate-900 dark:text-white">{briefing.subject}</strong>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: briefing.htmlBody }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

      {/* TAB CONTENT 8: SAVED FAVORITES / CUSTOM KIT */}
      {activeTab === "favorites" &&
        (() => {
          const filteredFavs =
            favoritesFilter === "all"
              ? favorites
              : favorites.filter((f) => f.type === favoritesFilter);

          const handleExportJson = () => {
            const dataStr = exportFavoritesJson();
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `solo-security-saved-kit-${activeTrip.destinationCity.toLowerCase()}.json`;
            link.click();
            URL.revokeObjectURL(url);
          };

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-black text-slate-900 dark:text-amber-50">
                    Saved Security Kit & Field Intelligence
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    Private, client-side bookmarks of verified gear, scam truth tables, and airport
                    arrival protocols.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/playbook/search/"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 font-display text-xs font-black text-slate-950 shadow-xs hover:bg-amber-300 transition"
                  >
                    <Icon name="search" className="size-3.5" />
                    <span>Explore Search Directory</span>
                  </Link>

                  {favorites.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={handleExportJson}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 font-display text-xs font-bold text-slate-700 shadow-xs hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <Icon name="download" className="size-3.5 text-amber-500" />
                        <span>Export JSON</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Clear all items from your saved kit?")) {
                            clearFavorites();
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 font-display text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/30"
                      >
                        <Icon name="trash" className="size-3.5" />
                        <span>Clear All</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Zero-PII Reassurance Banner */}
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-200">
                <Icon
                  name="shield"
                  className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                <div>
                  <strong>Zero-PII Local Storage Guarantee:</strong> Your saved favorites and custom
                  kit items reside 100% inside your browser&apos;s private local storage. No user
                  accounts, tracking cookies, or external servers are involved.
                </div>
              </div>

              {/* Filter Pills */}
              {favorites.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Items", count: favorites.length },
                    {
                      id: "product",
                      label: "Gear & Tools",
                      count: favorites.filter((f) => f.type === "product").length,
                    },
                    {
                      id: "scam",
                      label: "Scams & Truth Tables",
                      count: favorites.filter((f) => f.type === "scam").length,
                    },
                    {
                      id: "airport",
                      label: "Airport Hubs",
                      count: favorites.filter((f) => f.type === "airport").length,
                    },
                    {
                      id: "topic",
                      label: "Protocols",
                      count: favorites.filter((f) => f.type === "topic").length,
                    },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setFavoritesFilter(pill.id)}
                      className={`rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition ${
                        favoritesFilter === pill.id
                          ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <span>{pill.label}</span>{" "}
                      <span className="opacity-60 font-normal">({pill.count})</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Favorites List or Empty State */}
              {favorites.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                  <Icon
                    name="heart"
                    className="mx-auto size-10 text-slate-300 dark:text-slate-700"
                  />
                  <h4 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-amber-50">
                    Your private security kit is currently empty
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Browse the faceted intelligence directory and click the heart icon on any gear
                    item, scam truth table, or airport guide to save it here.
                  </p>
                  <Link
                    href="/playbook/search/"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 font-display text-xs font-black text-slate-950 shadow-xs hover:bg-amber-300"
                  >
                    <Icon name="search" className="size-3.5" />
                    <span>Browse Directory & Gear</span>
                  </Link>
                </div>
              ) : filteredFavs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-slate-800">
                  No saved items match this filter category.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFavs.map((fav) => (
                    <div
                      key={fav.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-lg px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider ${
                              fav.type === "product"
                                ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
                                : fav.type === "scam"
                                  ? "bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
                                  : fav.type === "airport"
                                    ? "bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
                                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {fav.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFavorite(fav.id)}
                            className="rounded-lg p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Remove from saved kit"
                          >
                            <Icon name="trash" className="size-3.5" />
                          </button>
                        </div>

                        <h4 className="mt-3 font-display text-sm font-black text-slate-900 dark:text-amber-50">
                          {fav.title}
                        </h4>

                        <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-slate-500">
                          <span>{fav.category}</span>
                          {fav.price && (
                            <>
                              <span>·</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {fav.price}
                              </span>
                            </>
                          )}
                          {fav.rating && (
                            <>
                              <span>·</span>
                              <span className="text-amber-500 font-bold">★ {fav.rating}</span>
                            </>
                          )}
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {fav.description}
                        </p>

                        {fav.badge && (
                          <div className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                            <Icon name="check" className="size-3" />
                            <span>{fav.badge}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                        {fav.type === "product" && fav.url.startsWith("http") ? (
                          <a
                            href={fav.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-display text-xs font-bold text-amber-600 hover:text-amber-500"
                          >
                            <span>Get Verified Product</span>
                            <Icon name="externalLink" className="size-3" />
                          </a>
                        ) : (
                          <Link
                            href={fav.url}
                            className="inline-flex items-center gap-1 font-display text-xs font-bold text-amber-600 hover:text-amber-500"
                          >
                            <span>Open Protocol</span>
                            <Icon name="arrowRight" className="size-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

      {/* NEW TRIP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Icon name="plus" className="size-4 text-amber-500" />
                <h3 className="font-display text-lg font-black text-slate-900 dark:text-white">
                  Add New Solo Travel Trip
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="mt-6 space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="new-trip-city"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    City Name
                  </label>
                  <input
                    id="new-trip-city"
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-trip-country"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    Country
                  </label>
                  <input
                    id="new-trip-country"
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => {
                      setNewCountry(e.target.value);
                      setNewIso2(e.target.value.slice(0, 2).toUpperCase());
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="new-trip-risk-tier"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    Operational Risk Tier
                  </label>
                  <select
                    id="new-trip-risk-tier"
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Low">Low Risk (e.g. Tokyo, Reykjavik)</option>
                    <option value="Moderate">Moderate Risk (e.g. Barcelona, Rome)</option>
                    <option value="Elevated">Elevated Risk (e.g. Medellín, Nairobi)</option>
                    <option value="High">High Risk (Extreme Precaution)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="new-trip-arrival-hour"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    Arrival Hour (0-23)
                  </label>
                  <input
                    id="new-trip-arrival-hour"
                    type="number"
                    min={0}
                    max={23}
                    value={newHour}
                    onChange={(e) => setNewHour(Number.parseInt(e.target.value, 10))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="new-trip-start-date"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    Start Date
                  </label>
                  <input
                    id="new-trip-start-date"
                    type="date"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-trip-end-date"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    End Date
                  </label>
                  <input
                    id="new-trip-end-date"
                    type="date"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="new-trip-lodging-type"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    Lodging Type
                  </label>
                  <select
                    id="new-trip-lodging-type"
                    value={newLodgingType}
                    onChange={(e) => setNewLodgingType(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="hotel">Standard Hotel</option>
                    <option value="rental_airbnb">Vacation Rental / Airbnb</option>
                    <option value="hostel_dorm">Hostel Shared Dorm</option>
                    <option value="hostel_private">Hostel Private Room</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="new-trip-lodging-floor"
                    className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                  >
                    Lodging Floor
                  </label>
                  <select
                    id="new-trip-lodging-floor"
                    value={newLodgingFloor}
                    onChange={(e) => setNewLodgingFloor(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="ground">Ground Floor (Vulnerable Entry)</option>
                    <option value="floors_2_to_4">Floors 2 to 4 (Tactical Ideal)</option>
                    <option value="floors_5_plus">Floors 5+ (Fire Evacuation Risk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-trip-lodging-name"
                  className="block font-mono text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400"
                >
                  Lodging Name / Neighborhood
                </label>
                <input
                  id="new-trip-lodging-name"
                  type="text"
                  value={newLodgingName}
                  onChange={(e) => setNewLodgingName(e.target.value)}
                  placeholder="e.g. Old Town Riverside Boutique Hotel"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-amber-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-display text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-400 px-5 py-2 font-display text-xs font-black text-slate-950 shadow-sm hover:bg-amber-300"
                >
                  Generate Trip Playbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
