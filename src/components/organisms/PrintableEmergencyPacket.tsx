"use client";

import { Icon } from "@/components/atoms/Icon";
import type { TripPlan, TravelerPersona } from "@/lib/personalization/types";
import { getDestinationBySlug, TOP_SOLO_DESTINATIONS } from "@/data/destinations";
import { getCountryByIso2 } from "@/data/geo/countries";
import { getMedicalTranslations } from "@/lib/personalization/medical-translator";

interface PrintableEmergencyPacketProps {
  trip: TripPlan;
  persona: TravelerPersona;
  onClose?: () => void;
}

export function PrintableEmergencyPacket({
  trip,
  persona,
  onClose,
}: PrintableEmergencyPacketProps) {
  const dest = getDestinationBySlug(trip.destinationCity.toLowerCase()) || TOP_SOLO_DESTINATIONS[0];
  const country = getCountryByIso2(trip.destinationCountryIso2);

  const policeNumber =
    dest.emergencyNumbers.generalOrPolice || country?.emergencyNumbers.police || "112";
  const ambulanceNumber =
    dest.emergencyNumbers.ambulance || country?.emergencyNumbers.ambulance || "112";
  const touristPoliceNumber =
    dest.emergencyNumbers.touristPolice || country?.emergencyNumbers.touristPolice;
  const consularPhone = country?.consularHotlines.usEmbassyPhone || "+1-202-501-4444";
  const medicalTranslations = getMedicalTranslations(dest.primaryLanguage || "English");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* On-screen control bar (hidden when printed) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 print:hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-amber-400 p-2 text-slate-950">
            <Icon name="download" className="size-4" />
          </span>
          <div>
            <h4 className="font-display text-sm font-black text-slate-900 dark:text-amber-50">
              Analog Emergency Lifejacket (Printable Packet)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Formatted for standard A4 or Letter printing. Fits inside your physical passport
              sleeve.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-display text-xs font-black text-amber-50 shadow-sm hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
          >
            <Icon name="download" className="size-3.5" />
            <span>Print or Save to PDF</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2 font-display text-xs font-bold text-slate-600 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* PRINTABLE CONTAINER */}
      <div className="space-y-8 rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm sm:p-10 print:m-0 print:border-none print:p-0 print:shadow-none text-slate-900">
        {/* DOCUMENT HEADER */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700">
                OFFICIAL SOLO TRAVEL CONTINGENCY DOSSIER · ZERO BATTERY BACKUP
              </span>
              <h1 className="font-display text-2xl font-black sm:text-3xl">
                {trip.destinationCity.toUpperCase()}, {trip.destinationCountry.toUpperCase()}
              </h1>
            </div>
            <div className="text-right font-mono text-[11px]">
              <div>
                Traveler: <strong>{persona.travelerName}</strong>
              </div>
              <div>
                Citizenship: <strong>{persona.citizenship}</strong>
              </div>
              <div>
                Dates: <strong>{trip.startDate}</strong> to <strong>{trip.endDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: WALLET CUTOUT CARD (Dotted lines for scissors) */}
        <div className="relative rounded-2xl border-2 border-dashed border-slate-400 bg-slate-50/70 p-6 print:bg-transparent">
          <div className="absolute -top-3 left-6 bg-white px-2 font-mono text-[9px] font-black uppercase tracking-widest text-slate-600">
            ✂ FOLD OR CUT FOR PASSPORT SLEEVE / WALLET (CREDIT CARD DIMENSIONS)
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Front: Dispatch & Lodging */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono text-[10px] font-black uppercase text-amber-700">
                  CRITICAL DISPATCH
                </span>
                <span className="font-mono text-[10px] font-bold">
                  {dest.name}, {dest.country}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Police</span>
                  <strong className="text-base">{policeNumber}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Ambulance</span>
                  <strong className="text-base">{ambulanceNumber}</strong>
                </div>
                {touristPoliceNumber && (
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">
                      Tourist Police
                    </span>
                    <strong className="text-xs">{touristPoliceNumber}</strong>
                  </div>
                )}
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block">Consular Desk</span>
                  <strong className="text-[11px]">{consularPhone}</strong>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 text-[11px]">
                <span className="font-mono text-[9px] uppercase text-slate-500 block">
                  Lodging Address:
                </span>
                <strong className="font-display">{trip.lodgingName || "Lodging"}</strong>
                <div className="font-mono text-[10px] text-slate-600">
                  {trip.lodgingAddress || `${dest.name} Center`}
                </div>
              </div>
            </div>

            {/* Back: Emergency Medical Alert & Contact */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono text-[10px] font-black uppercase text-rose-700">
                  MEDICAL ALERT & ICE
                </span>
                <span className="rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[9px] font-black text-rose-800">
                  {persona.medicalProfile.bloodType}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="font-mono text-[9px] uppercase text-slate-500 block">
                    Severe Allergies:
                  </span>
                  <span className="font-bold text-rose-800">
                    {persona.medicalProfile.allergies.join(", ") || "None Reported"}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase text-slate-500 block">
                    Emergency Contact:
                  </span>
                  <span className="font-bold">
                    {persona.emergencyContacts[0]?.name} ({persona.emergencyContacts[0]?.relation})
                  </span>
                  <div className="font-mono text-[11px]">{persona.emergencyContacts[0]?.phone}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2 text-[10px] font-mono text-slate-600">
                Guardian Pass ID:{" "}
                <strong>GRD-{trip.guardianPassToken?.toUpperCase() || "TOKYO"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCAL PHONETIC MEDICAL FLASHCARDS */}
        <div>
          <h3 className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Destination Language Emergency Phrases ({dest.primaryLanguage})
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Show this section directly to local doctors, paramedics, or police officers if
            incapacitated.
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {medicalTranslations.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase">
                  {m.english}
                </span>
                <div className="mt-1 font-display text-sm font-black text-slate-900">
                  {m.translated}
                </div>
                {m.phonetic && (
                  <div className="mt-1 font-mono text-[10px] text-amber-800">
                    Phonetic: &ldquo;{m.phonetic}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: INGRESS CHECKLIST & ESCALATION LADDER */}
        <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-slate-200">
          <div>
            <h4 className="font-mono text-xs font-black uppercase text-slate-900">
              Arrival Ingress Protocol
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <span>[ ]</span>
                <span>
                  <strong>Ignore Terminal Touts:</strong> Proceed exclusively to official taxi desk
                  or verified app pickup.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>[ ]</span>
                <span>
                  <strong>Child-Lock Inspection:</strong> Test interior rear door handle before
                  closing car door.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>[ ]</span>
                <span>
                  <strong>Daypack Placement:</strong> Keep bag with passport and money on lap—never
                  in trunk.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span>[ ]</span>
                <span>
                  <strong>Door Wedge Deployment:</strong> Wedge rubber door stop under room door
                  upon check-in.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-black uppercase text-slate-900">
              Home Escalation Protocol (If Check-in Missed)
            </h4>
            <ol className="mt-2 space-y-1 text-xs text-slate-700 list-decimal list-inside">
              <li>Wait 60 minutes for flight/baggage/customs delay.</li>
              <li>
                Call traveler phone:{" "}
                <strong className="font-mono">{persona.emergencyContacts[0]?.phone}</strong>.
              </li>
              <li>
                Check online Guardian Pass:{" "}
                <span className="font-mono text-[11px]">
                  solotravelsecurity.com/guardian/{trip.guardianPassToken}
                </span>
                .
              </li>
              <li>Call hotel reception directly.</li>
              <li>
                Call Consular Crisis Hotline: <strong className="font-mono">{consularPhone}</strong>
                .
              </li>
            </ol>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 pt-3 text-center font-mono text-[10px] text-slate-500">
          Generated on {new Date().toLocaleDateString()} by SoloTravelSecurity Field Engine ·
          Client-Side Local Storage · Free from cloud logs
        </div>
      </div>
    </div>
  );
}
