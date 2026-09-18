import type { RiskTier } from "../engine/types";

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface EnrichedCountry {
  iso2: string; // ISO 3166-1 alpha-2 (e.g., "IT")
  iso3: string; // ISO 3166-1 alpha-3 (e.g., "ITA")
  name: string; // "Italy"
  nativeName: string; // "Italia"
  capital: string; // "Rome"
  currencyCode: string; // "EUR"
  currencySymbol: string; // "€"
  currencyName: string; // "Euro"
  phonePrefix: string; // "+39"
  region: string; // "Europe"
  subregion: string; // "Southern Europe"
  wikidataId: string; // "Q38"
  coordinates: GeoCoordinate;
  defaultRiskTier: RiskTier;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    touristPolice?: string;
  };
  consularHotlines: {
    usEmbassyPhone: string;
    ukEmbassyPhone: string;
    ausEmbassyPhone: string;
  };
  electricalStandards: {
    voltage: string; // "230V"
    frequency: string; // "50Hz"
    plugTypes: string[]; // ["C", "F", "L"]
  };
  overview?: string;
  keySafetyRules?: string[];
  primaryCities?: string[];
}

export interface EnrichedCityGeo {
  slug: string;
  name: string;
  countryCode: string; // "IT"
  stateCode?: string;
  coordinates: GeoCoordinate;
  wikidataId: string; // e.g. "Q220" for Rome
  population?: number;
  riskTier: RiskTier;
  primaryAirportCode: string; // "FCO"
}
