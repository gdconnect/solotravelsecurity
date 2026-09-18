/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: unknown; output: unknown };
  JSON: { input: unknown; output: unknown };
};

export type ArmTripwireInput = {
  checkInTimeUtc: Scalars["String"]["input"];
  contactEmail: Scalars["String"]["input"];
  encryptedPayload: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

/** Input filter for faceted search query. */
export type FacetedSearchFilterInput = {
  archetypes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  categories?: InputMaybe<Array<Scalars["String"]["input"]>>;
  formats?: InputMaybe<Array<SearchItemFormat>>;
  priceTiers?: InputMaybe<Array<PriceTierBracket>>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  riskTiers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  types?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** Input for saving an item to anonymous session favorites. */
export type FavoriteItemInput = {
  badge?: InputMaybe<Scalars["String"]["input"]>;
  category: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  notes?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["String"]["input"]>;
  rating?: InputMaybe<Scalars["Float"]["input"]>;
  title: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type GenerateChecklistInput = {
  archetype?: InputMaybe<Scalars["String"]["input"]>;
  criticalOnly?: InputMaybe<Scalars["Boolean"]["input"]>;
  destinationRiskTier?: InputMaybe<RiskTier>;
  phaseId?: InputMaybe<Scalars["String"]["input"]>;
  pillarId?: InputMaybe<Scalars["String"]["input"]>;
};

export enum GuardianStatus {
  Amber = "AMBER",
  Green = "GREEN",
  Red = "RED",
}

/** Price tier bracket for filtering. */
export enum PriceTierBracket {
  Above_50 = "ABOVE_50",
  Between_25And_50 = "BETWEEN_25_AND_50",
  Free = "FREE",
  Under_25 = "UNDER_25",
}

/** Operational security threat tier. */
export enum RiskTier {
  Elevated = "ELEVATED",
  High = "HIGH",
  Low = "LOW",
  Moderate = "MODERATE",
}

/** Item format/medium classification. */
export enum SearchItemFormat {
  CustomsRule = "CUSTOMS_RULE",
  DigitalTool = "DIGITAL_TOOL",
  FieldProtocol = "FIELD_PROTOCOL",
  PhysicalGear = "PHYSICAL_GEAR",
  TruthTable = "TRUTH_TABLE",
}

export type SituationalContextInput = {
  arrivalHour: Scalars["Int"]["input"];
  cellularType?: InputMaybe<Scalars["String"]["input"]>;
  destinationRiskTier: RiskTier;
  experienceLevel?: InputMaybe<Scalars["String"]["input"]>;
  lodgingFloor: Scalars["String"]["input"];
  lodgingType: Scalars["String"]["input"];
};

/** Input filter for faceted search query. */

/** Input for saving an item to anonymous session favorites. */

/** Price tier bracket for filtering. */

/** Operational security threat tier. */

/** Item format/medium classification. */

export type AllCountriesQueryVariables = Exact<{
  region?: string | null | undefined;
  riskTier?: RiskTier | null | undefined;
  search?: string | null | undefined;
}>;

export type AllCountriesQuery = {
  countries: Array<{
    iso2: string;
    iso3: string;
    name: string;
    nativeName: string | null;
    capital: string;
    currencyCode: string;
    currencySymbol: string;
    region: string;
    defaultRiskTier: RiskTier;
    emergencyNumbers: { police: string; ambulance: string; touristPolice: string | null };
    electricalStandards: { voltage: string; plugTypes: Array<string> };
  }>;
};

export type BreadcrumbsForRouteQueryVariables = Exact<{
  path: string;
}>;

export type BreadcrumbsForRouteQuery = {
  breadcrumbsForRoute: Array<{ label: string; href: string | null; position: number }>;
};

export type ConfirmHeartbeatMutationVariables = Exact<{
  token: string;
  milestoneId: string;
}>;

export type ConfirmHeartbeatMutation = {
  confirmIngressHeartbeat: {
    token: string;
    status: GuardianStatus;
    nextWindowUtc: string;
    milestones: Array<{
      id: string;
      label: string;
      expectedTime: string;
      completedTime: string | null;
      status: string;
    }>;
  };
};

export type CountryByIso2QueryVariables = Exact<{
  iso2: string | number;
}>;

export type CountryByIso2Query = {
  country: {
    iso2: string;
    iso3: string;
    name: string;
    nativeName: string | null;
    capital: string;
    currencyCode: string;
    currencySymbol: string;
    currencyName: string;
    phonePrefix: string;
    region: string;
    subregion: string;
    wikidataId: string | null;
    defaultRiskTier: RiskTier;
    overview: string;
    keySafetyRules: Array<string>;
    coordinates: { latitude: number; longitude: number };
    emergencyNumbers: {
      police: string;
      ambulance: string;
      fire: string;
      touristPolice: string | null;
    };
    consularHotlines: { usEmbassyPhone: string; ukEmbassyPhone: string; ausEmbassyPhone: string };
    electricalStandards: { voltage: string; frequency: string; plugTypes: Array<string> };
    primaryCities: Array<{
      slug: string;
      name: string;
      primaryAirportCode: string;
      riskTier: RiskTier;
    }>;
  } | null;
};

export type DecisionTablesQueryVariables = Exact<{ [key: string]: never }>;

export type DecisionTablesQuery = {
  decisionTables: Array<{
    id: string;
    title: string;
    description: string;
    pillarId: string;
    defaultAction: unknown;
    conditionColumns: Array<{
      key: string;
      label: string;
      type: string;
      allowedValues: Array<string> | null;
      unit: string | null;
    }>;
    actionColumns: Array<{ key: string; label: string; type: string }>;
    rules: Array<{
      ruleId: string;
      scenario: string;
      priority: number;
      conditions: unknown;
      actions: unknown;
    }>;
  }>;
};

export type GenerateChecklistQueryVariables = Exact<{
  input?: GenerateChecklistInput | null | undefined;
}>;

export type GenerateChecklistQuery = {
  generateChecklist: {
    generatedAt: string;
    totalItems: number;
    criticalCount: number;
    spofCount: number;
    items: Array<{
      id: string;
      title: string;
      description: string;
      pillarId: string;
      phaseId: string;
      criticality: string;
      isSPOF: boolean;
      verificationType: string;
      applicableArchetypes: Array<string>;
      minimumRiskTier: RiskTier;
      decisionTableRef: string | null;
      truthTableRef: string | null;
      scoringDeductionPoints: number;
      recommendedGearSkus: Array<string>;
    }>;
    byPillar: Array<{
      id: string;
      name: string;
      slug: string;
      items: Array<{
        id: string;
        title: string;
        criticality: string;
        isSPOF: boolean;
        scoringDeductionPoints: number;
      }>;
    }>;
    byPhase: Array<{
      id: string;
      name: string;
      slug: string;
      items: Array<{
        id: string;
        title: string;
        criticality: string;
        isSPOF: boolean;
        scoringDeductionPoints: number;
      }>;
    }>;
  };
};

export type GuardianPortalQueryVariables = Exact<{
  token: string | number;
}>;

export type GuardianPortalQuery = {
  guardianPortal: {
    token: string;
    travelerName: string;
    destinationCity: string;
    destinationCountry: string;
    status: GuardianStatus;
    nextWindowUtc: string;
    readinessScore: number;
    readinessGrade: string;
    milestones: Array<{
      id: string;
      label: string;
      expectedTime: string;
      completedTime: string | null;
      status: string;
    }>;
    consularHotlines: { usEmbassyPhone: string; ukEmbassyPhone: string; ausEmbassyPhone: string };
    emergencyNumbers: {
      police: string;
      ambulance: string;
      fire: string;
      touristPolice: string | null;
    };
  } | null;
};

export type MatchedProductsQueryVariables = Exact<{
  context: SituationalContextInput;
}>;

export type MatchedProductsQuery = {
  matchedProducts: Array<{
    sku: string;
    name: string;
    category: string;
    howToRole: string;
    priorityRank: number;
    situationalRationale: string;
    isPrimaryRecommendation: boolean;
    price: string;
    priceCurrency: string;
    affiliateUrl: string;
    brand: string;
    author: string | null;
    isbn: string | null;
    ratingValue: number;
    ratingCount: number;
    pros: Array<string>;
    cons: Array<string>;
  }>;
};

export type RemoveFavoriteMutationVariables = Exact<{
  sessionToken: string;
  itemId: string | number;
}>;

export type RemoveFavoriteMutation = { removeFavorite: boolean };

export type SaveFavoriteMutationVariables = Exact<{
  sessionToken: string;
  item: FavoriteItemInput;
}>;

export type SaveFavoriteMutation = {
  saveFavorite: {
    id: string;
    type: string;
    title: string;
    url: string;
    category: string;
    description: string;
    price: string | null;
    rating: number | null;
    badge: string | null;
    savedAt: string;
    notes: string | null;
  };
};

export type SearchFacetedItemsQueryVariables = Exact<{
  filter?: FacetedSearchFilterInput | null | undefined;
}>;

export type SearchFacetedItemsQuery = {
  searchFacetedItems: {
    totalCount: number;
    items: Array<{
      id: string;
      title: string;
      slug: string;
      url: string;
      type: string;
      category: string;
      categoryLabel: string;
      description: string;
      tagline: string | null;
      format: SearchItemFormat;
      priceTier: PriceTierBracket;
      priceFormatted: string | null;
      rating: number | null;
      ratingCount: number | null;
      affiliateUrl: string | null;
      keyHighlight: string | null;
    }>;
    facetCounts: {
      types: Array<{ value: string; label: string; count: number }>;
      categories: Array<{ value: string; label: string; count: number }>;
      formats: Array<{ value: string; label: string; count: number }>;
      priceTiers: Array<{ value: string; label: string; count: number }>;
      riskTiers: Array<{ value: string; label: string; count: number }>;
    };
  };
};

export type SecurityTruthTablesQueryVariables = Exact<{ [key: string]: never }>;

export type SecurityTruthTablesQuery = {
  truthTables: Array<{
    id: string;
    title: string;
    description: string;
    scenarioCategory: string;
    completenessVerified: boolean;
    propositions: Array<{ symbol: string; key: string; name: string; description: string }>;
    rows: Array<{
      rowId: string;
      inputs: unknown;
      outputs: unknown;
      formalRationale: string | null;
    }>;
  }>;
};

export type TaxonomyTreeQueryVariables = Exact<{ [key: string]: never }>;

export type TaxonomyTreeQuery = {
  securityPillars: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    weight: number;
    icon: string;
    primaryDirectives: Array<string>;
  }>;
  lifecyclePhases: Array<{
    id: string;
    name: string;
    slug: string;
    order: number;
    description: string;
    typicalWindow: string;
  }>;
};

export type UserFavoritesQueryVariables = Exact<{
  sessionToken: string;
}>;

export type UserFavoritesQuery = {
  userFavorites: Array<{
    id: string;
    type: string;
    title: string;
    url: string;
    category: string;
    description: string;
    price: string | null;
    rating: number | null;
    badge: string | null;
    savedAt: string;
    notes: string | null;
  }>;
};
