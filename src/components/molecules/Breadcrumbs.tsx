import Link from "next/link";
import { JsonLd } from "@/components/atoms/JsonLd";
import { SITE_URL } from "@/lib/schema";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ items, className = "", showHome = true }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = showHome ? [{ label: "Home", href: "/" }, ...items] : items;

  // Generate Schema.org BreadcrumbList JSON-LD
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? {
            item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
          }
        : {}),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} />
      <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;

            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-slate-400 dark:text-slate-600" aria-hidden="true">
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="font-bold text-slate-900 dark:text-amber-50"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
