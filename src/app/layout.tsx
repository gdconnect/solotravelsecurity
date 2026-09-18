import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/atoms";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, siteGraph } from "@/lib/schema";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Coming soon`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: { icon: "/icon.svg" },
  applicationName: SITE_NAME,
  keywords: [
    "solo travel security",
    "solo female travel safety",
    "travel scams",
    "situational awareness travel",
    "solo travel tips",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Coming soon`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Coming soon`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Dark mode driven by pure CSS via prefers-color-scheme in globals.css —
    // no inline script, no FOUC, no parse blocking.
    // Notify form uses native HTML POST to /api/notify (no client JS).
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-amber-50 transition-colors duration-200">
        <JsonLd data={siteGraph()} />
        {children}
      </body>
    </html>
  );
}
