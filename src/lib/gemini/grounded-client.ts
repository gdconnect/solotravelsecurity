/**
 * src/lib/gemini/grounded-client.ts
 *
 * Google Gemini API Client with Google Search Grounding & Constrained JSON Schema Decoding.
 *
 * Capabilities:
 * - Direct execution via Gemini API (REST / SDK endpoint: https://generativelanguage.googleapis.com/v1beta/models)
 * - Grounding via Google Search (`tools: [{ googleSearch: {} }]`)
 * - Native schema-constrained generation (`responseMimeType: "application/json"`, `responseSchema`)
 * - Automated citation parsing from `groundingMetadata`
 * - Two-tier validation boundary: token-level schema + Zod semantic validation
 * - Self-healing repair loop: automatically retries model with precise Zod error paths
 */

import { z } from "zod";
import type {
  GeminiModel,
  GeminiHarvestRequest,
  GroundedHarvestResult,
  GroundedCitation,
  GeminiGroundingMetadata,
} from "./types";
import { validateWithZod, generateRepairPrompt } from "./schema-compiler";

export class GeminiGroundedClient {
  private apiKey: string;
  private defaultModel: GeminiModel;
  private baseUrl: string;

  constructor(options?: { apiKey?: string; defaultModel?: GeminiModel; baseUrl?: string }) {
    this.apiKey = options?.apiKey || process.env.GEMINI_API_KEY || "";
    this.defaultModel = options?.defaultModel || "gemini-2.0-flash";
    this.baseUrl = options?.baseUrl || "https://generativelanguage.googleapis.com/v1beta/models";
  }

  /**
   * Executes a grounded harvest against Google Gemini API with JSON Schema constraints.
   */
  public async harvestWithSchema<T>(
    request: GeminiHarvestRequest,
    zodSchema: z.ZodType<T>,
    options?: { maxRepairAttempts?: number; mockPayload?: unknown },
  ): Promise<GroundedHarvestResult<T>> {
    const model = request.model || this.defaultModel;
    const maxAttempts = options?.maxRepairAttempts ?? 2;
    const harvestedAt = new Date().toISOString();

    // If a mock payload is provided (e.g. offline testing or fixtures), run validation directly
    if (options?.mockPayload) {
      const valResult = validateWithZod(zodSchema, options.mockPayload);
      if (valResult.success) {
        return {
          success: true,
          data: valResult.data,
          citations: [
            {
              title: "Verified Grounded Registry Fixture",
              url: "https://solotravelsecurity.internal/grounding",
              confidenceScore: 0.99,
            },
          ],
          searchQueriesUsed: ["mock:grounded-fixture"],
          harvestedAt,
          modelUsed: model,
        };
      }
      return {
        success: false,
        validationErrors: valResult.errors,
        citations: [],
        searchQueriesUsed: [],
        harvestedAt,
        modelUsed: model,
      };
    }

    if (!this.apiKey) {
      return {
        success: false,
        validationErrors: [
          "GEMINI_API_KEY is not set. Set GEMINI_API_KEY in environment or provide options.mockPayload for testing.",
        ],
        citations: [],
        searchQueriesUsed: [],
        harvestedAt,
        modelUsed: model,
      };
    }

    let currentPrompt = request.prompt;
    let attempts = 0;
    let lastRawResponse = "";
    let lastErrors: string[] = [];

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const payload: Record<string, unknown> = {
          contents: [...(request.multimodalParts || []), { parts: [{ text: currentPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: request.schema,
            temperature: 0.1, // Low temperature for high factual rigor
          },
        };

        if (request.systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: request.systemInstruction }],
          };
        }

        if (request.enableGoogleSearch !== false) {
          payload.tools = [{ googleSearch: {} }];
        }

        const endpoint = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API HTTP ${response.status}: ${errText}`);
        }

        const resData = (await response.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
            groundingMetadata?: GeminiGroundingMetadata;
          }>;
        };

        const candidate = resData.candidates?.[0];
        const rawText = candidate?.content?.parts?.[0]?.text || "";
        lastRawResponse = rawText;

        // Parse JSON
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          lastErrors = ["Model failed to emit valid JSON despite responseMimeType."];
          currentPrompt = generateRepairPrompt(lastErrors, rawText);
          continue;
        }

        // Validate with Zod defensive boundary
        const validation = validateWithZod(zodSchema, parsed);
        if (validation.success) {
          // Extract Grounding Citations
          const citations = this.extractCitations(candidate?.groundingMetadata);
          const searchQueriesUsed = candidate?.groundingMetadata?.webSearchQueries || [];

          return {
            success: true,
            data: validation.data,
            citations,
            searchQueriesUsed,
            rawJsonResponse: rawText,
            harvestedAt,
            modelUsed: model,
          };
        }

        // Schema validation failed: trigger self-healing repair turn
        lastErrors = validation.errors;
        currentPrompt = generateRepairPrompt(lastErrors, rawText);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        lastErrors.push(`API invocation exception: ${message}`);
        break;
      }
    }

    return {
      success: false,
      validationErrors: lastErrors,
      rawJsonResponse: lastRawResponse,
      citations: [],
      searchQueriesUsed: [],
      harvestedAt,
      modelUsed: model,
    };
  }

  /**
   * Transforms Gemini API groundingMetadata into structured GroundedCitation records.
   */
  private extractCitations(metadata?: GeminiGroundingMetadata): GroundedCitation[] {
    if (!metadata || !metadata.groundingChunks) return [];

    const citations: GroundedCitation[] = [];
    const chunks = metadata.groundingChunks;

    chunks.forEach((chunk, index) => {
      if (chunk.web && chunk.web.uri) {
        // Look up associated support confidence if present
        const support = metadata.groundingSupports?.find((s) =>
          s.groundingChunkIndices.includes(index),
        );
        const confidenceScore = support?.confidenceScores?.[0] ?? 0.85;

        citations.push({
          title: chunk.web.title || "Official Web Grounding Source",
          url: chunk.web.uri,
          groundingSnippet: support?.segment?.text,
          confidenceScore,
        });
      }
    });

    return citations;
  }
}
