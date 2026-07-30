import { defineDocs, defineConfig } from "fumadocs-mdx/config";

/**
 * Content lives in content/ at the repo root — not content/docs — because this
 * app *is* the documentation site. There is no other kind of page to namespace
 * it away from, and the extra directory would show up in every file path for no
 * reason.
 */
export const docs = defineDocs({
  dir: "content",
});

export default defineConfig({
  mdxOptions: {
    // The site is dark-only (see app/globals.css), so a light code theme would
    // be the one bright rectangle on every page.
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
