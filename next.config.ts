import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  // Same standalone output as the console, so the Dockerfile can ship a
  // self-contained server without node_modules.
  output: "standalone",
};

/**
 * Compiles content/ into .source at build time.
 *
 * `macro: false` turns off fumadocs-mdx's build-time macro feature. Leaving it
 * on registers a Turbopack loader against every .js/.ts/.tsx in the project so
 * it can look for a `fumadocs-mdx/macro` import — a whole-project sweep to
 * support something the documentation does not use.
 *
 * Note there is deliberately **no `postinstall` script** in package.json.
 * `createMDX` regenerates `.source` during `next build`, and a postinstall hook
 * fires during `npm ci` in the Docker `deps` stage — where only package.json
 * exists, no `source.config.ts` and no `content/`. The CLI then falls through to
 * its Vite adapter and dies with `Cannot find package 'vite'`. That broke the
 * console's image build once already; do not add the hook back.
 */
const withMDX = createMDX({ macro: false });

/**
 * Turbopack parses next.config by serialising it to JSON, and fumadocs-mdx
 * scopes its meta-file loaders with `condition: { query: /…/ }`. A RegExp has
 * no JSON representation, so it reaches Turbopack as `{}` and fails schema
 * validation outright:
 *
 *   FATAL: failed to parse next.config.js
 *   turbopack.rules.*.json: data did not match any variant of untagged enum Either
 *
 * Deleting the condition is not a fix, and the build says so clearly. The rule
 * also carries `as: "*.js"`, so an unscoped `*.json` rule declares every JSON in
 * the project to be JavaScript — including node_modules manifests:
 *
 *   ./node_modules/@grpc/grpc-js/package.json.js:2:9
 *   Parsing ecmascript source code failed
 *
 * So the scope is re-expressed as something Turbopack can actually represent: a
 * path glob. Only meta files under content/ are ever imported with the
 * `?collection=` query the loader looks for, so narrowing the rule to that
 * directory preserves the intent exactly and leaves every other JSON alone.
 *
 * Revisit when Turbopack's rule schema accepts conditions, or when
 * fumadocs-mdx stops putting regexes in config.
 */
function scopeMetaRulesToContentDir(config: NextConfig): NextConfig {
  const rules = config.turbopack?.rules;
  if (!rules) return config;

  type Rules = NonNullable<NonNullable<NextConfig["turbopack"]>["rules"]>;
  const scoped: Rules = {};

  for (const [glob, rule] of Object.entries(rules)) {
    if (!rule || typeof rule !== "object" || !("condition" in rule)) {
      scoped[glob] = rule;
      continue;
    }

    const rest = Object.fromEntries(
      Object.entries(rule as Record<string, unknown>).filter(
        ([key]) => key !== "condition"
      )
    );

    // `*.json` / `*.yaml` -> `**/content/**/*.json`
    const extension = glob.replace(/^\*/, "");
    scoped[`**/content/**/*${extension}`] = rest as Rules[string];
  }

  return { ...config, turbopack: { ...config.turbopack, rules: scoped } };
}

export default scopeMetaRulesToContentDir(withMDX(nextConfig));
