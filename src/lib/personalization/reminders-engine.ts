import type { TripPlan, PersonalizedReminder, TravelerPersona } from "./types";

/**
 * Generates an exhaustive, situation-calibrated set of security reminders
 * tailored to the traveler's specific destination, risk tier, lodging, transit mode, and profile.
 */
export function generatePersonalizedReminders(
  trip: TripPlan,
  persona?: TravelerPersona,
): PersonalizedReminder[] {
  const isHighRisk = trip.destinationRiskTier === "Elevated" || trip.destinationRiskTier === "High";
  const isNightArrival = trip.arrivalHour >= 20 || trip.arrivalHour < 6;
  const isGroundLodging = trip.lodgingFloor === "ground" || trip.lodgingType === "rental_airbnb";
  const isSoloFemale = persona?.genderIdentity === "female" || persona?.archetype === "solo-female";

  const reminders: PersonalizedReminder[] = [
    // -------------------------------------------------------------
    // PHASE 1: PRE-TRIP PREPARATION (T-30d to T-24h)
    // -------------------------------------------------------------
    {
      id: "REM-PRE-FIN-01",
      phase: "pre_trip",
      triggerOffsetLabel: "T-72h Before Departure",
      category: "financial",
      priority: "CRITICAL",
      isSpofGuarded: true,
      title: "Financial Redundancy & Card Segregation Protocol",
      summary:
        "Segregate primary, secondary, and emergency payment channels across distinct physical luggage compartments.",
      actionProtocol: [
        "Notify card issuers of international departure to avoid automated fraud lockouts.",
        "Set up minimum 2 independent banking apps with instant digital card freeze.",
        "Store Card #1 in front-pocket daily wallet, Card #2 in hidden waist pouch, Card #3 in luggage lining.",
        `Prepare emergency cash reserve ($100-$200 USD/EUR) in crisp, uncreased, high-denomination notes.`,
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-PRE-FIN-01") ?? false,
      calendarOffsetHours: -72,
    },
    {
      id: "REM-PRE-DIG-02",
      phase: "pre_trip",
      triggerOffsetLabel: "T-48h Before Departure",
      category: "digital",
      priority: "HIGH",
      isSpofGuarded: false,
      title: "Offline Zero-Bandwidth Map Pre-Caching",
      summary: `Cache offline vector maps for ${trip.destinationCity} and pre-pin lodging and emergency stations.`,
      actionProtocol: [
        `Download offline area in Google Maps for ${trip.destinationCity}.`,
        "Download offline vector maps on Organic Maps or OsmAnd as zero-signal backup.",
        `Pin exact address of ${trip.lodgingName || "lodging"} and nearest police precinct offline.`,
        "Take screenshot of offline map with local language address characters.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-PRE-DIG-02") ?? false,
      calendarOffsetHours: -48,
    },
    {
      id: "REM-PRE-CON-03",
      phase: "pre_trip",
      triggerOffsetLabel: "T-24h Before Departure",
      category: "consular",
      priority: isHighRisk ? "CRITICAL" : "HIGH",
      isSpofGuarded: isHighRisk,
      title: "Consular Crisis Registry & Guardian Pass Dispatch",
      summary:
        "Register itinerary with sovereign consular desk and issue live Guardian Pass to emergency contact.",
      actionProtocol: [
        "Register travel dates with national foreign ministry (e.g. US STEP, UK Travel Advice, AU Smartraveller).",
        "Save 24/7 consular crisis desk hotline to phone contacts with international '+' prefix.",
        "Share read-only Guardian Pass link with primary emergency contact.",
        "Agree upon a maximum acceptable silence window (e.g. 12 hours) before escalation.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-PRE-CON-03") ?? false,
      calendarOffsetHours: -24,
    },

    // -------------------------------------------------------------
    // PHASE 2: IN-TRANSIT & INGRESS (T-0 to First 120 Minutes)
    // -------------------------------------------------------------
    {
      id: "REM-TRN-AIR-01",
      phase: "in_transit",
      triggerOffsetLabel: "T+0 Arrival Touchdown",
      category: "transit",
      priority: "CRITICAL",
      isSpofGuarded: true,
      title: "Arrival Hall Air-Gap & Ground Transport Vetting",
      summary:
        "Bypass aggressive arrival hall touts and proceed directly to authenticated airport transit.",
      actionProtocol: [
        "Decline all informal drivers approaching inside the terminal; maintain forward momentum.",
        "Locate official prepaid taxi desk, official airport taxi queue, or designated app rideshare pickup zone.",
        "Confirm destination address on driver's GPS or app before moving luggage into vehicle.",
        "Keep daily backpack with passport, phone, and money on your lap—never in the car trunk.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-TRN-AIR-01") ?? false,
      linkedDecisionTableId: "DT-INGRESS-TRANSIT",
      calendarOffsetHours: 0,
    },
    {
      id: "REM-TRN-VEH-02",
      phase: "in_transit",
      triggerOffsetLabel: isNightArrival ? "T+30m Night Ingress Warning" : "T+30m Transit Ingress",
      category: "transit",
      priority: isNightArrival ? "CRITICAL" : "HIGH",
      isSpofGuarded: isNightArrival,
      title: isNightArrival
        ? "Hostile Night Transit & Child-Lock Inspection"
        : "Vehicle Entry & Route Tracking",
      summary: "Conduct physical lock check before closing door and monitor live route navigation.",
      actionProtocol: [
        "Verify vehicle registration plate, car model, and driver face against ride-booking record.",
        "Open rear door and test interior door handle to ensure child-safety lock is disengaged.",
        "Sit directly behind the driver (not in passenger seat) to maintain visual supremacy.",
        "Keep phone GPS tracking active on offline map to ensure vehicle stays on expected trajectory.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-TRN-VEH-02") ?? false,
      linkedTruthTableId: "TT-NIGHT-INGRESS",
      calendarOffsetHours: 1,
    },
    {
      id: "REM-TRN-HRT-03",
      phase: "in_transit",
      triggerOffsetLabel: "T+60m Transit Ingress",
      category: "digital",
      priority: "HIGH",
      isSpofGuarded: false,
      title: "Touchdown Heartbeat Verification Ping",
      summary: "Send single-tap arrival confirmation to reset emergency countdown timer.",
      actionProtocol: [
        "Connect to authenticated cellular data (eSIM active).",
        "Send pre-scripted safe arrival ping to designated home contact.",
        "Confirm estimated time of arrival (ETA) at lodging.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-TRN-HRT-03") ?? false,
      calendarOffsetHours: 1.5,
    },

    // -------------------------------------------------------------
    // PHASE 3: IN-DESTINATION DAILY OPERATIONS (Day 1 - Egress)
    // -------------------------------------------------------------
    {
      id: "REM-DST-PER-01",
      phase: "in_destination",
      triggerOffsetLabel: "Day 1 Lodging Arrival (T+120m)",
      category: "perimeter",
      priority: "CRITICAL",
      isSpofGuarded: true,
      title: `${trip.lodgingType === "rental_airbnb" ? "Vacation Rental" : "Lodging"} Physical Perimeter Lock-Down`,
      summary: "Conduct room inspection, physical latch testing, and secondary barrier deployment.",
      actionProtocol: [
        "Inspect door deadbolt, keycard strike plate, and peephole cover.",
        isGroundLodging
          ? "Verify ground-floor window latches and balcony sliding doors are physically locked."
          : "Verify exterior windows and adjoining room doors are secured.",
        "Install secondary mechanical door wedge or portable travel lock on main door.",
        "Locate secondary emergency fire exit stairs from room hallway.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-DST-PER-01") ?? false,
      linkedDecisionTableId: "DT-LODGING-FLOOR",
      calendarOffsetHours: 2,
    },
    {
      id: "REM-DST-SNT-02",
      phase: "in_destination",
      triggerOffsetLabel: "Daily at 18:00 (Sunset)",
      category: "transit",
      priority: "HIGH",
      isSpofGuarded: false,
      title: "Sunset Tactical Posture Transition",
      summary: "Shift from daylight walking mode to evening secured movement protocols.",
      actionProtocol: [
        "Transition from foot travel to pre-booked verified rideshare in unfamiliar neighborhoods.",
        "Move mobile phone and primary cards into interior zipped jackets or under-clothing belts.",
        "Maintain situational awareness: remove both earbuds and avoid checking screen at crosswalks.",
        isSoloFemale
          ? "Keep a confident stride; ignore unsolicited greetings from loitering groups."
          : "Keep hands free; avoid displaying jewelry, designer shopping bags, or camera bodies.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-DST-SNT-02") ?? false,
      isRecurringDaily: true,
    },
    {
      id: "REM-DST-HRT-03",
      phase: "in_destination",
      triggerOffsetLabel: "Daily at 21:00 (Heartbeat)",
      category: "consular",
      priority: "HIGH",
      isSpofGuarded: false,
      title: "Nightly All-Clear Safety Heartbeat",
      summary:
        "One-tap verification that lodging is secured for the night, resetting the dead-man timer.",
      actionProtocol: [
        "Confirm return to safe lodging perimeter.",
        "Deploy door wedge for overnight rest.",
        "Tap 'Send Heartbeat' on portal to log all-clear status for family contacts.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-DST-HRT-03") ?? false,
      isRecurringDaily: true,
    },
    {
      id: "REM-DST-STR-04",
      phase: "in_destination",
      triggerOffsetLabel: "In-Field Encounter Standard",
      category: "perimeter",
      priority: "HIGH",
      isSpofGuarded: false,
      title: "Plainclothes Authority & Street Impostor Shield",
      summary:
        "Deterministic de-escalation posture if approached by individuals claiming police power.",
      actionProtocol: [
        "Never surrender physical passport or money on the open sidewalk to plainclothes persons.",
        "Display laminated color photocopy of passport and visa through your hands.",
        "State firmly: 'We will walk together to the nearest police station to verify.'",
        "If threatened with imminent physical violence, surrender decoy cash wallet and escape into public shop.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-DST-STR-04") ?? false,
      linkedTruthTableId: "TT-STREET-ENCOUNTER",
    },

    // -------------------------------------------------------------
    // PHASE 4: POST-TRIP EGRESS & AUDIT (T+24h to T+72h)
    // -------------------------------------------------------------
    {
      id: "REM-PST-FIN-01",
      phase: "post_trip",
      triggerOffsetLabel: "T+24h Post-Return",
      category: "financial",
      priority: "HIGH",
      isSpofGuarded: false,
      title: "Overseas Payment Skimming & Card Audit",
      summary:
        "Scan all payment accounts used during travel for fraudulent pending authorizations or cloning.",
      actionProtocol: [
        "Review online statements for unrecognized micro-transactions ($0.50-$2.00 test charges).",
        "Re-enable international spending freeze on secondary and backup cards.",
        "Destroy any temporary paper notes containing ATM withdrawal pins or door codes.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-PST-FIN-01") ?? false,
    },
    {
      id: "REM-PST-REV-02",
      phase: "post_trip",
      triggerOffsetLabel: "T+72h Post-Return",
      category: "consular",
      priority: "STANDARD",
      isSpofGuarded: false,
      title: "Operational Debrief & Readiness Recalibration",
      summary:
        "Document close calls, update safe zone coordinates, and recalibrate your solo readiness score.",
      actionProtocol: [
        "Deregister from consular foreign travel tracking (e.g. mark trip completed on STEP).",
        "Archive and securely store backup passport photocopies in home safe.",
        "Log neighborhood scam observations to the SoloTravelSecurity intelligence database.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-PST-REV-02") ?? false,
    },
  ];

  // Specific accommodation modifiers:
  if (trip.lodgingType === "hostel_dorm") {
    reminders.push({
      id: "REM-DST-HST-01",
      phase: "in_destination",
      triggerOffsetLabel: "Daily Hostel Protocol",
      category: "perimeter",
      priority: "HIGH",
      isSpofGuarded: true,
      title: "Hostel Dorm Locker & Asset Lockdown",
      summary: "Never leave passport, laptop, or backup cash unsecured in shared dorm rooms.",
      actionProtocol: [
        "Secure locker using your personal hardened steel padlock (never use hostel-provided locks).",
        "Keep phone charging inside the locker or under your pillow while sleeping.",
        "Never disclose your full travel itinerary or banking status to casual dorm acquaintances.",
      ],
      isCompleted: trip.completedReminderIds?.includes("REM-DST-HST-01") ?? false,
    });
  }

  return reminders;
}
