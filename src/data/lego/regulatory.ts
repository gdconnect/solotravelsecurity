import type { RegulatoryLandmineDossier } from "@/lib/schemas/lego-blocks";

export const PREPOPULATED_REGULATORY_LANDMINES: RegulatoryLandmineDossier[] = [
  {
    id: "reg-japan-stimulants-adderall",
    countryCode: "JP",
    countryName: "Japan",
    category: "medication_controlled",
    title: "ADHD Stimulants (Adderall / Dexamphetamine) Zero-Tolerance Ban",
    restrictedSubstancesOrItems: [
      "Adderall (dextroamphetamine / amphetamine)",
      "Dexedrine",
      "Vyvanse (requires strict advance Yunyu Kakunin-sho)",
      "Pseudoephedrine / Sudafed (active ingredient > 10%)",
    ],
    legalStatus: "strictly_banned",
    permitName: "Yakkan Shoumei / Yunyu Kakunin-sho (Import Confirmation Certificate)",
    permitLeadTimeDays: 21,
    permitApplicationUrl:
      "https://www.mhlw.go.jp/english/policy/health-medical/pharmaceuticals/01.html",
    penaltySummary:
      "Immediate detention, arrest, criminal investigation, and deportation. Carrying unapproved amphetamines into Japan is treated as illicit drug trafficking under the Stimulants Control Act.",
    proceduralAction:
      "Do NOT bring Adderall into Japan under any circumstances (it cannot be approved even with a doctor's letter). Consult your physician 60 days before travel to switch to an approved alternative (such as Concerta/Methylphenidate) and submit a Yakkan Shoumei application at least 3 weeks prior.",
  },

  {
    id: "reg-thailand-vaping-prohibition",
    countryCode: "TH",
    countryName: "Thailand",
    category: "vaping_customs",
    title: "Electronic Cigarettes & Vapes Total Prohibition",
    restrictedSubstancesOrItems: [
      "E-cigarettes",
      "Vape pens and pods",
      "E-liquids (with or without nicotine)",
      "IQOS / heated tobacco devices",
    ],
    legalStatus: "strictly_banned",
    penaltySummary:
      "Possession is illegal under Ministry of Commerce and Customs Act. Penalties include confiscation, on-the-spot extortion fines ranging from 20,000 to 50,000 THB ($600-$1,500 USD), or up to 5 years imprisonment.",
    proceduralAction:
      "Leave all vaping devices, pods, and chargers at home. Never pack them in carry-on or checked baggage when entering Thailand. Police in Bangkok frequently target foreign tourists using vapes along Sukhumvit Road.",
  },

  {
    id: "reg-italy-rome-alcohol-curfew",
    countryCode: "IT",
    countryName: "Italy",
    category: "alcohol_curfew",
    title: "Rome Nighttime Public Alcohol Consumption & Glass Bottle Decrees",
    restrictedSubstancesOrItems: [
      "Drinking alcohol on public streets or plazas",
      "Carrying open glass bottles in public spaces between 22:00 and 07:00",
      "Takeaway alcohol sales from convenience stores after 22:00",
    ],
    legalStatus: "curfew_enforced",
    penaltySummary: "Administrative fines from €150 to €500 issued immediately by Polizia Locale.",
    proceduralAction:
      "Drink alcohol only inside licensed bar/restaurant premises or outdoor permitted seating areas. Never walk between nightlife venues in Trastevere, Campo de' Fiori, or San Lorenzo with an open beer or wine bottle.",
  },

  {
    id: "reg-japan-passport-carriage",
    countryCode: "JP",
    countryName: "Japan",
    category: "id_carriage",
    title: "Mandatory Original Passport Carriage for Foreign Nationals",
    restrictedSubstancesOrItems: [
      "Photocopy of passport (NOT accepted by Japanese police)",
      "Digital smartphone photo of passport (NOT accepted)",
    ],
    legalStatus: "strictly_banned",
    penaltySummary:
      "Failure to produce original passport upon request by a police officer carries a fine of up to ¥100,000 (approx $700 USD) and escort to the police station (Koban) for verification.",
    proceduralAction:
      "Keep your original physical passport secured in an under-clothing neck wallet or zippered interior pocket at all times. A photocopy is insufficient under Japanese Immigration Control and Refugee Recognition Act Article 23.",
  },
];

export function getRegulatoryLandminesForCountry(countryCode: string): RegulatoryLandmineDossier[] {
  return PREPOPULATED_REGULATORY_LANDMINES.filter(
    (r) => r.countryCode.toUpperCase() === countryCode.toUpperCase(),
  );
}
