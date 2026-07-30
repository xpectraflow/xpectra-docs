import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import "./globals.css";

/**
 * Inter, actually loaded.
 *
 * The console declares `--font-sans: "Inter", …` in its globals.css but never
 * loads the face, so production has always rendered the system fallback. This
 * app is where the intent finally matches the output. `display: swap` so text
 * paints immediately rather than blocking on the font.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.xpectraflow.com"),
  title: {
    default: "XpectraFlow documentation",
    template: "%s — XpectraFlow docs",
  },
  description:
    "Ingest, query and annotate engineering telemetry over HTTP, gRPC and NATS.",
};

/**
 * Root layout. Owns <html> and <body>, which the console's own root layout used
 * to supply when the docs were mounted inside it.
 *
 * `theme={{ enabled: false }}` keeps the site dark-only. The console hardcodes
 * `className="dark"` and has no light theme, so a toggle here would offer a
 * pairing that exists nowhere else in the product.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider theme={{ enabled: false }}>
          <DocsLayout
            tree={source.pageTree}
            nav={{
              title: (
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Image src="/logo.svg" alt="" width={20} height={20} />
                  XpectraFlow docs
                </span>
              ),
              url: "/",
            }}
            links={[
              { text: "Console", url: "https://app.xpectraflow.com", external: true },
              { text: "Discord", url: "https://discord.gg/EjV8FB5NxV", external: true },
            ]}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
