/**
 * src/lib/graphql/fetch.ts
 *
 * Isomorphic GraphQL transport — the application's single data-fetching primitive.
 * Zero-runtime footprint (~1.2 kB) avoiding heavy Apollo/Relay clients.
 *
 * Server (Cloudflare Worker / SSR / Build): env.API_URL
 * Client: NEXT_PUBLIC_API_URL
 * Fixture Mode: NEXT_PUBLIC_USE_FIXTURES=1 intercepts requests and returns mock data.
 */

export interface GraphQLErrorItem {
  message: string;
  [key: string]: unknown;
}

export type GraphQLFetchErrorKind = "network" | "http" | "graphql";

export class GraphQLFetchError extends Error {
  readonly kind: GraphQLFetchErrorKind;
  readonly status: number | undefined;
  readonly errors: GraphQLErrorItem[];

  constructor(
    kind: GraphQLFetchErrorKind,
    message: string,
    status?: number,
    errors: GraphQLErrorItem[] = [],
  ) {
    super(message);
    this.name = "GraphQLFetchError";
    this.kind = kind;
    this.status = status;
    this.errors = errors;
  }
}

export interface FetchGraphQLOptions<TVars> {
  query: string;
  variables?: TVars;
  token?: string;
}

interface ResolvedTarget {
  url: string;
  token?: string;
}

const OPERATION_NAME_RE = /^\s*(?:query|mutation)\s+([A-Za-z_][A-Za-z0-9_]*)/m;

type FixtureResolver = (variables?: any) => unknown;

async function resolveFixture<TData>(query: string, variables: unknown): Promise<TData> {
  const { GRAPHQL_FIXTURES } = await import("./fixtures");
  const registry: Record<string, FixtureResolver> = GRAPHQL_FIXTURES;
  const operationName = OPERATION_NAME_RE.exec(query)?.[1] ?? "<anonymous>";
  const entry = registry[operationName];

  if (entry === undefined) {
    const message = `[graphql] No fixture registered for operation "${operationName}" (NEXT_PUBLIC_USE_FIXTURES=1).`;
    console.error(message);
    throw new Error(message);
  }

  return entry(variables ?? {}) as TData;
}

async function resolveTarget(token?: string): Promise<ResolvedTarget> {
  const apiUrl =
    process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.solotravelsecurity.com";

  return { url: apiUrl, token };
}

export async function fetchGraphQL<TData, TVars = Record<string, unknown>>(
  options: FetchGraphQLOptions<TVars>,
): Promise<TData> {
  if (fixtureModeEnabled()) {
    return resolveFixture<TData>(options.query, options.variables);
  }

  const target = await resolveTarget(options.token);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  if (target.token) {
    headers.Authorization = `Bearer ${target.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${target.url}/graphql`, {
      method: "POST",
      cache: "no-store",
      headers,
      body: JSON.stringify({ query: options.query, variables: options.variables }),
    });
  } catch (cause) {
    throw new GraphQLFetchError("network", `GraphQL network request failed: ${String(cause)}`);
  }

  if (!response.ok) {
    throw new GraphQLFetchError(
      "http",
      `GraphQL request returned HTTP ${response.status}`,
      response.status,
    );
  }

  const body = (await response.json()) as { data?: TData; errors?: GraphQLErrorItem[] };

  if (body.errors !== undefined && body.errors.length > 0) {
    throw new GraphQLFetchError(
      "graphql",
      body.errors[0]?.message ?? "GraphQL operation failed",
      response.status,
      body.errors,
    );
  }

  return body.data as TData;
}

export function fixtureModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_FIXTURES === "1" || process.env.NODE_ENV === "test";
}
