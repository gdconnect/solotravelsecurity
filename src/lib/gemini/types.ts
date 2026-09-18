/**
 * src/lib/gemini/types.ts
 *
 * Types for Google Gemini API Data Layer Integration.
 * Defines configuration, response schemas (OpenAPI 3.0 / JSON Schema subset),
 * Google Search Grounding tools, citation models, and multimodal audit payloads.
 */

export type GeminiModel =
  | "gemini-2.0-flash"
  | "gemini-2.0-pro"
  | "gemini-1.5-flash"
  | "gemini-1.5-pro";

export type GeminiSchemaType = "STRING" | "NUMBER" | "INTEGER" | "BOOLEAN" | "ARRAY" | "OBJECT";

export interface GeminiResponseSchema {
  type: GeminiSchemaType;
  format?: string;
  description?: string;
  nullable?: boolean;
  enum?: string[];
  properties?: Record<string, GeminiResponseSchema>;
  required?: string[];
  items?: GeminiResponseSchema;
}

export interface GeminiToolGoogleSearch {
  googleSearch: Record<string, never>;
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  responseMimeType?: "application/json" | "text/plain";
  responseSchema?: GeminiResponseSchema;
}

export interface GeminiGroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GeminiGroundingChunk {
  web?: GeminiGroundingChunkWeb;
}

export interface GeminiGroundingSupportSegment {
  startIndex?: number;
  endIndex?: number;
  text?: string;
}

export interface GeminiGroundingSupport {
  groundingChunkIndices: number[];
  confidenceScores?: number[];
  segment?: GeminiGroundingSupportSegment;
}

export interface GeminiGroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: GeminiGroundingChunk[];
  groundingSupports?: GeminiGroundingSupport[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

export interface GroundedCitation {
  title: string;
  url: string;
  groundingSnippet?: string;
  confidenceScore?: number;
}

export interface GroundedHarvestResult<T> {
  success: boolean;
  data?: T;
  citations: GroundedCitation[];
  searchQueriesUsed: string[];
  rawJsonResponse?: string;
  validationErrors?: string[];
  harvestedAt: string;
  modelUsed: GeminiModel;
}

export interface MultimodalPartText {
  text: string;
}

export interface MultimodalPartInlineData {
  inlineData: {
    mimeType: string;
    data: string; // Base64 encoded
  };
}

export type MultimodalPart = MultimodalPartText | MultimodalPartInlineData;

export interface GeminiHarvestRequest {
  targetEntity: string;
  prompt: string;
  systemInstruction?: string;
  model?: GeminiModel;
  schema: GeminiResponseSchema;
  enableGoogleSearch?: boolean;
  multimodalParts?: MultimodalPart[];
}
