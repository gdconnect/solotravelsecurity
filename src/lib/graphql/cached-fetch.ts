/**
 * src/lib/graphql/cached-fetch.ts
 *
 * Allowlist-gated edge cache over fetchGraphQL.
 * Collapses burst SSR reads into single upstream calls against Laravel Lighthouse throttles.
 * Only successful data is cached; errors always propagate uncached.
 */

import { fetchGraphQL, fixtureModeEnabled, type FetchGraphQLOptions } from "./fetch";

const CACHEABLE_OPERATIONS = new Set([
  "AllCountries",
  "CountryByIso2",
  "AllCities",
  "MatchedProducts",
]);

const TTL_SECONDS = 60;
const CACHE_URL_PREFIX = "https://graphql-cache.internal/";

export interface CacheStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, ttlSeconds: number): Promise<void>;
}

function cacheApiStore(cache: Cache): CacheStore {
  return {
    async get(key) {
      const hit = await cache.match(`${CACHE_URL_PREFIX}${key}`);
      return hit === undefined ? null : hit.text();
    },
    async put(key, value, ttlSeconds) {
      await cache.put(
        `${CACHE_URL_PREFIX}${key}`,
        new Response(value, {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${ttlSeconds}`,
          },
        }),
      );
    },
  };
}

async function resolveStore(): Promise<CacheStore | null> {
  if (typeof caches !== "undefined" && "default" in caches) {
    return cacheApiStore((caches as unknown as { default: Cache }).default);
  }
  return null;
}

export interface CachedFetchOptions<TVars> extends FetchGraphQLOptions<TVars> {
  operationName: string;
}

export async function cachedFetchGraphQL<TData, TVars = Record<string, unknown>>(
  options: CachedFetchOptions<TVars>,
): Promise<TData> {
  if (fixtureModeEnabled() || !CACHEABLE_OPERATIONS.has(options.operationName)) {
    return fetchGraphQL<TData, TVars>(options);
  }

  const store = await resolveStore();
  if (!store) {
    return fetchGraphQL<TData, TVars>(options);
  }

  const cacheKey = `${options.operationName}:${JSON.stringify(options.variables ?? {})}`;
  const hit = await store.get(cacheKey);

  if (hit !== null) {
    try {
      return JSON.parse(hit) as TData;
    } catch {
      // JSON parse error, fall through to fetch
    }
  }

  const data = await fetchGraphQL<TData, TVars>(options);
  try {
    await store.put(cacheKey, JSON.stringify(data), TTL_SECONDS);
  } catch (err) {
    console.warn(`[graphql-cache] Failed to put key ${cacheKey}:`, err);
  }

  return data;
}
