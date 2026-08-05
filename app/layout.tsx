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
    "Ingest, query and annotate engineering telemetry over HTTP and gRPC.",
};

/**
 * Root layout. Owns <html> and <body>, which the console's own root layout used
 * to supply when the docs were mounted inside it.
 *
 * Both themes are live, and three things have to agree for the toggle to work:
 *
 *   1. no hardcoded `dark` class on <html> — next-themes owns that class, and a
 *      static one silently wins over whatever the user picks;
 *   2. `RootProvider` left at its defaults so the provider is actually mounted;
 *   3. light and dark tokens defined under *separate* selectors in globals.css.
 *
 * Miss any one and the switch appears to do nothing. `defaultTheme: "dark"` so
 * a first-time reader lands on the palette that matches the console, while
 * still being free to change it.
 *
 * `suppressHydrationWarning` is required: next-themes sets the class on the
 * client before React hydrates, so the server and client markup differ by
 * design on this one element.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider theme={{ defaultTheme: "dark" }}>
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
