/**
 * src/lib/gemini/schema-compiler.ts
 *
 * Schema Compiler: Transforms TypeScript Zod Schemas into Google Gemini API
 * OpenAPI 3.0 / JSON Schema subset (`responseSchema`).
 *
 * Provides runtime bidirectional guarantees:
 * 1. Complies Zod schemas to token-level constrained decoding specifications for Gemini.
 * 2. Validates incoming model generation payloads against defensive boundaries.
 * 3. Synthesizes automated self-healing repair prompts if validation catches schema violations.
 */

import { z } from "zod";
import type { GeminiResponseSchema, GeminiSchemaType } from "./types";

/**
 * Recursively converts a Zod schema into Gemini API's OpenAPI 3.0 subset.
 */
export function zodToGeminiSchema(schema: unknown): GeminiResponseSchema {
  if (!schema || typeof schema !== "object") {
    return { type: "STRING" };
  }

  const anySchema = schema as {
    _def?: Record<string, unknown>;
    def?: Record<string, unknown>;
    description?: string;
  };

  const def = anySchema._def || anySchema.def || {};
  const description =
    anySchema.description || (typeof def.description === "string" ? def.description : undefined);

  const typeName = (def.type || def.typeName || "") as string;

  // 1. Unwrap Optional
  if (typeName === "optional" || typeName === "ZodOptional") {
    const inner = (def.innerType || def.schema) as unknown;
    const compiled = zodToGeminiSchema(inner);
    if (description && !compiled.description) {
      compiled.description = description;
    }
    return compiled;
  }

  // 2. Unwrap Nullable
  if (typeName === "nullable" || typeName === "ZodNullable") {
    const inner = (def.innerType || def.schema) as unknown;
    const compiled = zodToGeminiSchema(inner);
    compiled.nullable = true;
    if (description && !compiled.description) {
      compiled.description = description;
    }
    return compiled;
  }

  // 3. String & Enums
  if (typeName === "string" || typeName === "ZodString") {
    return {
      type: "STRING",
      ...(description ? { description } : {}),
    };
  }

  if (typeName === "enum" || typeName === "ZodEnum") {
    let enumValues: string[] = [];
    if (Array.isArray(def.values)) {
      enumValues = def.values.map(String);
    } else if (def.entries && typeof def.entries === "object") {
      enumValues = Object.keys(def.entries);
    }
    return {
      type: "STRING",
      enum: enumValues,
      ...(description ? { description } : {}),
    };
  }

  // 4. Numbers & Integers
  if (typeName === "number" || typeName === "ZodNumber") {
    const isInt =
      def.isInt === true ||
      (Array.isArray(def.checks) &&
        def.checks.some((c: unknown) => {
          if (!c || typeof c !== "object") return false;
          const checkObj = c as Record<string, unknown>;
          return (
            checkObj.kind === "int" ||
            checkObj.type === "number" ||
            String((checkObj.def as Record<string, unknown>)?.type || "").includes("int")
          );
        }));

    return {
      type: (isInt ? "INTEGER" : "NUMBER") as GeminiSchemaType,
      ...(description ? { description } : {}),
    };
  }

  // 5. Booleans
  if (typeName === "boolean" || typeName === "ZodBoolean") {
    return {
      type: "BOOLEAN",
      ...(description ? { description } : {}),
    };
  }

  // 6. Arrays
  if (typeName === "array" || typeName === "ZodArray") {
    const elementSchema = (def.element || def.type) as unknown;
    return {
      type: "ARRAY",
      items: zodToGeminiSchema(elementSchema),
      ...(description ? { description } : {}),
    };
  }

  // 7. Objects
  if (typeName === "object" || typeName === "ZodObject") {
    let shapeObj: Record<string, unknown> = {};
    if (typeof def.shape === "function") {
      shapeObj = def.shape();
    } else if (def.shape && typeof def.shape === "object") {
      shapeObj = def.shape as Record<string, unknown>;
    }

    const properties: Record<string, GeminiResponseSchema> = {};
    const required: string[] = [];

    for (const [key, propSchema] of Object.entries(shapeObj)) {
      const propDef = ((propSchema as { _def?: Record<string, unknown> })?._def ||
        (propSchema as { def?: Record<string, unknown> })?.def ||
        {}) as Record<string, unknown>;
      const propTypeName = (propDef.type || propDef.typeName || "") as string;

      properties[key] = zodToGeminiSchema(propSchema);

      // A property is required unless explicitly ZodOptional
      if (propTypeName !== "optional" && propTypeName !== "ZodOptional") {
        required.push(key);
      }
    }

    return {
      type: "OBJECT",
      properties,
      ...(required.length > 0 ? { required } : {}),
      ...(description ? { description } : {}),
    };
  }

  // 8. Literals (convert to string enum or type)
  if (typeName === "literal" || typeName === "ZodLiteral") {
    let val = "";
    if (def.value !== undefined) {
      val = String(def.value);
    } else if (def.values instanceof Set) {
      val = Array.from(def.values).map(String).join(",");
    }
    return {
      type: "STRING",
      enum: [val],
      ...(description ? { description } : {}),
    };
  }

  // 9. Records / Key-Value Maps (represent as generic Object)
  if (typeName === "record" || typeName === "ZodRecord") {
    return {
      type: "OBJECT",
      ...(description ? { description } : {}),
    };
  }

  // 10. Fallback for Unions (e.g. string or boolean)
  if (typeName === "union" || typeName === "ZodUnion") {
    const options = (def.options || []) as unknown[];
    // If all options are string literals, compile to enum
    const allLiterals = options.every((opt: unknown) => {
      const optDef = (opt as { _def?: { type?: string } })?._def;
      return optDef?.type === "literal" || optDef?.type === "ZodLiteral";
    });

    if (allLiterals && options.length > 0) {
      const enumVals: string[] = options.map((opt: unknown) => {
        const optDef = (opt as { _def?: { value?: unknown; values?: Set<unknown> } })?._def;
        if (optDef?.value !== undefined) return String(optDef.value);
        if (optDef?.values instanceof Set) return Array.from(optDef.values).map(String)[0] || "";
        return "";
      });
      return {
        type: "STRING",
        enum: enumVals,
        ...(description ? { description } : {}),
      };
    }

    return {
      type: "STRING",
      ...(description ? { description } : {}),
    };
  }

  // Default fallback
  return {
    type: "STRING",
    ...(description ? { description } : {}),
  };
}

/**
 * Validates raw data against a Zod schema, returning clean errors for repair loops.
 */
export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: string[]; errorSummary: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const formatted = result.error.issues.map(
    (issue) => `[${issue.path.join(".") || "root"}]: ${issue.message}`,
  );

  return {
    success: false,
    errors: formatted,
    errorSummary: formatted.slice(0, 5).join("; "),
  };
}

/**
 * Generates an automated self-healing repair prompt to instruct Gemini
 * to fix schema validation discrepancies.
 */
export function generateRepairPrompt(errors: string[], failedJsonSnippet: string): string {
  return [
    "Your previous response failed our strict Zod schema validation checks.",
    "Please fix the following specific errors and output ONLY the corrected JSON:",
    "",
    ...errors.map((e) => `- ${e}`),
    "",
    "Raw JSON that failed validation (excerpt):",
    failedJsonSnippet.length > 1000
      ? `${failedJsonSnippet.slice(0, 1000)}... [truncated]`
      : failedJsonSnippet,
    "",
    "Provide the completely corrected, valid JSON conforming strictly to the requested schema.",
  ].join("\n");
}
