import type { TripPlan, TravelerPersona } from "./types";
import { TOP_SOLO_DESTINATIONS, getDestinationBySlug } from "@/data/destinations";
import { getCountryByIso2 } from "@/data/geo/countries";

export interface GeneratedEmail {
  subject: string;
  textBody: string;
  htmlBody: string;
  mailtoUrl: string;
}

/**
 * Generates an authoritative, reassuring, and deterministic Pre-Trip Ingress Briefing Email
 * for designated emergency contacts, family, or partners before departure.
 */
export function generatePreTripBriefingEmail(
  trip: TripPlan,
  persona: TravelerPersona,
  siteUrl: string = "https://solotravelsecurity.com",
): GeneratedEmail {
  const dest = getDestinationBySlug(trip.destinationCity.toLowerCase()) || TOP_SOLO_DESTINATIONS[0];
  const country = getCountryByIso2(trip.destinationCountryIso2);

  const guardianUrl = `${siteUrl}/guardian/${trip.guardianPassToken || "tokyo"}`;
  const police = dest.emergencyNumbers.generalOrPolice || country?.emergencyNumbers.police || "112";
  const ambulance = dest.emergencyNumbers.ambulance || country?.emergencyNumbers.ambulance || "112";
  const touristPolice =
    dest.emergencyNumbers.touristPolice || country?.emergencyNumbers.touristPolice || "N/A";
  const consularPhone = country?.consularHotlines.usEmbassyPhone || "+1-202-501-4444";

  const primaryRecipient = persona.emergencyContacts.find((c) => c.isPrimary)?.email || "";

  const subject = `[Solo Travel Safety Briefing] ${persona.travelerName}'s Itinerary & Contingency Plan: ${trip.destinationCity}`;

  const textBody = `
===================================================================
SOLO TRAVEL PRE-TRIP SAFETY BRIEFING & CONTINGENCY PACKET
===================================================================

Dear ${persona.emergencyContacts[0]?.name || "Family & Emergency Contacts"},

I am departing for ${trip.destinationCity}, ${trip.destinationCountry} on ${trip.startDate}. 
To ensure peace of mind without constant messaging or invasive GPS tracking, I have prepared this standardized security dossier and emergency escalation protocol.

1. LIVE GUARDIAN INGRESS PASS (BOOKMARK THIS LINK)
-------------------------------------------------------------------
You can monitor my flight touchdown, transit ingress, and nightly safe hotel check-in milestones live at:
👉 ${guardianUrl}
(Status updates upon explicit one-tap verification; no battery-draining continuous GPS tracking).

2. TRIP PARAMETERS & LODGING
-------------------------------------------------------------------
- Destination: ${trip.destinationCity}, ${trip.destinationCountry} (Risk Tier: ${trip.destinationRiskTier})
- Dates: ${trip.startDate} to ${trip.endDate}
- Expected Arrival: ${String(trip.arrivalHour).padStart(2, "0")}:00 Local Time
- Confirmed Lodging: ${trip.lodgingName || "Confirmed Lodging"}
- Lodging Address: ${trip.lodgingAddress || `${trip.destinationCity} Center`}
- Lodging Floor: ${trip.lodgingFloor.replace(/_/g, " ")}

3. CRITICAL EMERGENCY CONTACTS & DISPATCH LINES
-------------------------------------------------------------------
- National Police: ${police}
- Medical / Ambulance: ${ambulance}
- Tourist Police: ${touristPolice}
- Sovereign Consular Crisis Desk: ${consularPhone}

4. MEDICAL & SAFETY DATA
-------------------------------------------------------------------
- Blood Type: ${persona.medicalProfile.bloodType}
- Severe Allergies: ${persona.medicalProfile.allergies.join(", ") || "None"}
- Emergency Notes: ${persona.medicalProfile.specialMedicalNotes || "None"}

5. DETERMINISTIC ESCALATION LADDER (IF CHECK-IN MISSED)
-------------------------------------------------------------------
My agreed check-in window is within 2 hours of flight touchdown and daily at 21:00 local time. If a scheduled check-in is missed:
  STEP 1: Wait 60 minutes (allow for airline gate holds, customs queues, or temporary transit dead zones).
  STEP 2: Call my primary mobile: ${persona.emergencyContacts.find((c) => c.isPrimary)?.phone || "mobile phone"}.
  STEP 3: Check the Guardian Pass link above for updated timestamp.
  STEP 4: If still unconfirmed after 3 hours, call the lodging reception directly.
  STEP 5: Contact the Consular Crisis Desk (${consularPhone}) with my passport details.

Please keep this email saved for the duration of my trip.

Love & safe travels,
${persona.travelerName}
Generated via SoloTravelSecurity Field Engine · Client-Side Encrypted
===================================================================
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 24px;">
  <div style="border-bottom: 3px solid #f59e0b; padding-bottom: 12px; margin-bottom: 24px;">
    <span style="font-family: monospace; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #b45309;">Solo Travel Security · Official Dossier</span>
    <h1 style="font-size: 22px; font-weight: 900; margin: 6px 0 0 0; color: #0f172a;">Pre-Trip Safety Briefing & Ingress Protocol</h1>
    <p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0;">Traveler: <strong>${persona.travelerName}</strong> · Destination: <strong>${trip.destinationCity}, ${trip.destinationCountry}</strong></p>
  </div>

  <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
    <strong style="font-size: 14px; color: #92400e; display: block; margin-bottom: 6px;">🛡️ The Live Guardian Pass</strong>
    <p style="font-size: 13px; color: #78350f; margin: 0 0 12px 0;">Bookmark this private link to verify my flight touchdown, arrival transit, and daily evening check-ins in real-time:</p>
    <a href="${guardianUrl}" style="display: inline-block; background-color: #f59e0b; color: #0f172a; font-weight: 800; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 8px;">Open Live Guardian Portal →</a>
  </div>

  <h2 style="font-size: 16px; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a;">1. Trip Details & Lodging</h2>
  <ul style="font-size: 13px; color: #334155; padding-left: 20px;">
    <li><strong>Dates:</strong> ${trip.startDate} to ${trip.endDate}</li>
    <li><strong>Arrival Hour:</strong> ${String(trip.arrivalHour).padStart(2, "0")}:00 Local Time</li>
    <li><strong>Lodging:</strong> ${trip.lodgingName || "Confirmed Lodging"}</li>
    <li><strong>Address:</strong> ${trip.lodgingAddress || `${trip.destinationCity} Center`}</li>
    <li><strong>Risk Tier:</strong> ${trip.destinationRiskTier}</li>
  </ul>

  <h2 style="font-size: 16px; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a; margin-top: 24px;">2. Emergency Dispatch Lines</h2>
  <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 8px;">
    <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0;">Police Emergency:</td><td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">${police}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #e2e8f0;">Ambulance / Medical:</td><td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">${ambulance}</td></tr>
    <tr style="background-color: #f8fafc;"><td style="padding: 8px; border: 1px solid #e2e8f0;">Consular Crisis Hotline:</td><td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">${consularPhone}</td></tr>
  </table>

  <h2 style="font-size: 16px; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; color: #0f172a; margin-top: 24px;">3. Escalation Ladder (If Check-In Missed)</h2>
  <ol style="font-size: 13px; color: #334155; padding-left: 20px;">
    <li><strong>Wait 60 minutes:</strong> Flights and customs lines often have minor delays.</li>
    <li><strong>Call Traveler Mobile:</strong> Attempt voice call and messaging.</li>
    <li><strong>Inspect Guardian Portal:</strong> Check if a recent checkpoint was logged.</li>
    <li><strong>Call Lodging Directly:</strong> Inquire with reception desk.</li>
    <li><strong>Call Consular Desk:</strong> (${consularPhone}) if unconfirmed after 3+ hours.</li>
  </ol>

  <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; font-family: monospace; color: #64748b;">
    SoloTravelSecurity Field Engine · Client-Side Local-First Privacy · Zero Central Logging
  </div>
</body>
</html>
`.trim();

  const mailtoUrl = `mailto:${encodeURIComponent(primaryRecipient)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(textBody)}`;

  return {
    subject,
    textBody,
    htmlBody,
    mailtoUrl,
  };
}
