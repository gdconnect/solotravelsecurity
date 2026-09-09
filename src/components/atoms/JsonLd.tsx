/**
 * ATOM — JsonLd.
 * Injects a JSON-LD structured-data graph for SEO / AI consumers.
 * Rendered server-side so crawlers always see it.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
