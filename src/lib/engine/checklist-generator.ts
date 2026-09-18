/**
 * src/lib/engine/checklist-generator.ts
 *
 * Dynamic situational checklist generation engine.
 * Tailors master checklist protocols to specific traveler archetypes,
 * destination risk tiers, travel lifecycle phases, and environmental parameters.
 */

import { MASTER_CHECKLIST_ITEMS, type ChecklistItem } from "@/data/checklists";
import { SECURITY_PILLARS, LIFECYCLE_PHASES } from "@/data/taxonomy";

export interface ChecklistGenerationParams {
  archetype?: string;
  destinationRiskTier?: "LOW" | "MODERATE" | "ELEVATED" | "HIGH";
  phaseId?: string;
  pillarId?: string;
  criticalOnly?: boolean;
}

export interface GeneratedChecklistGroup<T> {
  id: string;
  name: string;
  slug: string;
  items: T[];
}

export interface GeneratedChecklist {
  generatedAt: string;
  params: ChecklistGenerationParams;
  totalItems: number;
  criticalCount: number;
  spofCount: number;
  items: ChecklistItem[];
  byPillar: GeneratedChecklistGroup<ChecklistItem>[];
  byPhase: GeneratedChecklistGroup<ChecklistItem>[];
}

const RISK_TIER_LEVELS: Record<string, number> = {
  LOW: 1,
  MODERATE: 2,
  ELEVATED: 3,
  HIGH: 4,
};

export function generateSituationalChecklist(
  params: ChecklistGenerationParams = {},
): GeneratedChecklist {
  const {
    archetype = "all",
    destinationRiskTier = "MODERATE",
    phaseId,
    pillarId,
    criticalOnly = false,
  } = params;

  const currentRiskLevel = RISK_TIER_LEVELS[destinationRiskTier.toUpperCase()] ?? 2;

  const filteredItems = MASTER_CHECKLIST_ITEMS.filter((item) => {
    // 1. Archetype filter
    if (
      archetype !== "all" &&
      !item.applicableArchetypes.includes("all") &&
      !item.applicableArchetypes.includes(archetype)
    ) {
      return false;
    }

    // 2. Risk Tier threshold filter
    const itemMinRiskLevel = RISK_TIER_LEVELS[item.minimumRiskTier] ?? 1;
    if (itemMinRiskLevel > currentRiskLevel) {
      return false;
    }

    // 3. Phase filter
    if (phaseId && item.phaseId !== phaseId) {
      return false;
    }

    // 4. Pillar filter
    if (pillarId && item.pillarId !== pillarId) {
      return false;
    }

    // 5. Critical only filter
    if (criticalOnly && item.criticality !== "CRITICAL" && !item.isSPOF) {
      return false;
    }

    return true;
  });

  // Group by Pillar
  const byPillar: GeneratedChecklistGroup<ChecklistItem>[] = SECURITY_PILLARS.map((pillar) => ({
    id: pillar.id,
    name: pillar.name,
    slug: pillar.slug,
    items: filteredItems.filter((i) => i.pillarId === pillar.id),
  })).filter((group) => group.items.length > 0);

  // Group by Phase
  const byPhase: GeneratedChecklistGroup<ChecklistItem>[] = LIFECYCLE_PHASES.map((phase) => ({
    id: phase.id,
    name: phase.name,
    slug: phase.slug,
    items: filteredItems.filter((i) => i.phaseId === phase.id),
  })).filter((group) => group.items.length > 0);

  const criticalCount = filteredItems.filter((i) => i.criticality === "CRITICAL").length;
  const spofCount = filteredItems.filter((i) => i.isSPOF).length;

  return {
    generatedAt: new Date().toISOString(),
    params,
    totalItems: filteredItems.length,
    criticalCount,
    spofCount,
    items: filteredItems,
    byPillar,
    byPhase,
  };
}
