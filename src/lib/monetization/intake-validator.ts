/**
 * src/lib/monetization/intake-validator.ts
 *
 * TypeScript Partner & Offer Intake Validator.
 * Implements DT-INTAKE-VALIDATION-01 and TT-INTAKE-GATING-01.
 */

export interface ValidationIssue {
  field: string;
  code: string;
  message: string;
  severity: "CRITICAL" | "WARNING";
}

export interface IntakeValidationResult {
  isValid: boolean;
  status: "APPROVED_PRODUCTION" | "PENDING_MANUAL_REVIEW" | "REJECTED_COMPLIANCE";
  issues: ValidationIssue[];
}

/**
 * Validates a Partner Profile payload prior to ingestion.
 */
export function validatePartnerProfile(partner: any): IntakeValidationResult {
  const issues: ValidationIssue[] = [];

  if (!partner.partnerId || !partner.partnerId.startsWith("PARTNER-")) {
    issues.push({
      field: "partnerId",
      code: "INVALID_ID_FORMAT",
      message: "Partner ID must follow pattern ^PARTNER-[A-Z0-9_-]+$",
      severity: "CRITICAL",
    });
  }

  if (!partner.legalBusinessName || partner.legalBusinessName.trim().length < 2) {
    issues.push({
      field: "legalBusinessName",
      code: "MISSING_LEGAL_NAME",
      message: "Legal business name is required for commercial onboarding.",
      severity: "CRITICAL",
    });
  }

  if (!partner.primaryDomain || !partner.primaryDomain.startsWith("https://")) {
    issues.push({
      field: "primaryDomain",
      code: "INSECURE_DOMAIN",
      message: "Primary domain must use HTTPS.",
      severity: "CRITICAL",
    });
  }

  if (!partner.complianceStatus?.ftcDisclaimerAccepted) {
    issues.push({
      field: "complianceStatus.ftcDisclaimerAccepted",
      code: "FTC_DISCLOSURE_REJECTED",
      message: "Partner must accept FTC affiliate compensation disclosures.",
      severity: "CRITICAL",
    });
  }

  if (!partner.complianceStatus?.sanctionsComplianceConfirmed) {
    issues.push({
      field: "complianceStatus.sanctionsComplianceConfirmed",
      code: "SANCTIONS_NON_COMPLIANT",
      message: "Partner must confirm zero operation in OFAC/UN sanctioned jurisdictions.",
      severity: "CRITICAL",
    });
  }

  const hasCritical = issues.some((i) => i.severity === "CRITICAL");
  const hasWarning = issues.some((i) => i.severity === "WARNING");

  return {
    isValid: !hasCritical,
    status: hasCritical
      ? "REJECTED_COMPLIANCE"
      : hasWarning
        ? "PENDING_MANUAL_REVIEW"
        : "APPROVED_PRODUCTION",
    issues,
  };
}

/**
 * Validates a Partner Commercial Offer payload prior to ingestion.
 */
export function validatePartnerOffer(offer: any): IntakeValidationResult {
  const issues: ValidationIssue[] = [];

  if (!offer.offerId || !offer.offerId.startsWith("OFFER-")) {
    issues.push({
      field: "offerId",
      code: "INVALID_OFFER_ID",
      message: "Offer ID must match ^OFFER-[A-Z0-9_-]+$",
      severity: "CRITICAL",
    });
  }

  if (
    !offer.trackingConfig?.urlTemplate ||
    !offer.trackingConfig.urlTemplate.startsWith("https://")
  ) {
    issues.push({
      field: "trackingConfig.urlTemplate",
      code: "INSECURE_TRACKING_URL",
      message: "Tracking template must be a valid HTTPS URL.",
      severity: "CRITICAL",
    });
  }

  if (offer.editorialReview?.verifiedPhysicalTest === false) {
    issues.push({
      field: "editorialReview.verifiedPhysicalTest",
      code: "UNVERIFIED_PRODUCT",
      message: "Offer is pending physical verification by editorial testing staff.",
      severity: "WARNING",
    });
  }

  const hasCritical = issues.some((i) => i.severity === "CRITICAL");
  const hasWarning = issues.some((i) => i.severity === "WARNING");

  return {
    isValid: !hasCritical,
    status: hasCritical
      ? "REJECTED_COMPLIANCE"
      : hasWarning
        ? "PENDING_MANUAL_REVIEW"
        : "APPROVED_PRODUCTION",
    issues,
  };
}
