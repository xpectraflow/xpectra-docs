import type { ReactNode } from "react";

/**
 * The header block above every operation in the API reference.
 *
 * The reference is organised by resource — one page per noun, every operation
 * on it — so a single page carries five or six of these. Hand-writing the
 * method badge, the path and the required scope thirty-odd times across seven
 * pages guarantees they drift: one page bolds the method, another forgets the
 * scope, a third writes `datasets:write` where the code says `telemetry:write`.
 *
 * Passing `scope` is not optional, because "which scope does this need" is the
 * single most common reason an integration returns 403 and the answer has to be
 * next to the endpoint rather than in a table three pages away.
 */
const METHOD_STYLES: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
  POST: "bg-sky-500/10 text-sky-600 ring-sky-500/30 dark:text-sky-400",
};

export function Endpoint({
  method,
  path,
  scope,
  children,
}: {
  method: "GET" | "POST";
  path: string;
  /** The scope the route enforces, or `null` for the few that enforce none. */
  scope: string | null;
  children?: ReactNode;
}) {
  return (
    <div className="not-prose my-6 rounded-lg border border-fd-border bg-fd-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-fd-border px-4 py-3">
        <span
          className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ring-1 ring-inset ${
            METHOD_STYLES[method] ?? "bg-fd-muted text-fd-muted-foreground ring-fd-border"
          }`}
        >
          {method}
        </span>

        <code className="font-mono text-sm text-fd-foreground">{path}</code>

        <span className="ms-auto font-mono text-xs text-fd-muted-foreground">
          {scope ? (
            <>
              scope <span className="text-fd-foreground">{scope}</span>
            </>
          ) : (
            "no API key"
          )}
        </span>
      </div>

      {children ? (
        <div className="px-4 py-3 text-sm text-fd-muted-foreground">{children}</div>
      ) : null}
    </div>
  );
}
