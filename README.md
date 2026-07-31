# xpectra-docs

Public API documentation for XpectraFlow — [docs.xpectraflow.com](https://docs.xpectraflow.com).

A standalone Next.js + [Fumadocs](https://fumadocs.dev) site. It is wired into
the platform repo as a git submodule, but it builds, runs and deploys on its own.

## Why it is a separate repo

The docs used to live inside `xpectra-web`. That meant a typo fix rebuilt the
console image and shipped only with a full platform release, the docs could not
take a dependency without adding it to the console's bundle, and every URL
carried a redundant `/docs` prefix because Fumadocs generated hrefs from a base
of `/docs`.

Splitting it out fixes all three. This app serves from its own root, so
`content/authentication.mdx` is simply `docs.xpectraflow.com/authentication`.

## Running it

```bash
npm install
npm run dev
```

→ http://localhost:3000. No database, no environment variables, nothing else
running. That is the point.

## Writing

Content is MDX under `content/`. Add a file, add its slug to `content/meta.json`
to place it in the sidebar, done.

```
content/
  index.mdx           /
  concepts.mdx        /concepts
  authentication.mdx  /authentication
  conventions.mdx     /conventions
  meta.json           sidebar order
```

Available components are whatever `components/mdx-components.tsx` registers,
which today is the `fumadocs-ui/mdx` defaults: `<Callout>`, `<Cards>`, `<Card>`
and the `<CodeBlockTabs>` family. `<Tabs>`, `<Steps>`, `<Accordion>` and
`<TypeTable>` ship in the package but are **not** registered — using one renders
nothing. Add it to `mdx-components.tsx` first.

**Every curl in these docs is expected to work as printed.** If you change an
endpoint's behaviour, run the snippet before you change the prose.

## Deploying

Pushing to `main` builds an image, pushes it to GHCR, and restarts only the
docs container on the box. It does not require or trigger a platform release.

The platform repo also pins this repo as a submodule; that pointer is bumped
automatically so each release records which docs commit shipped with it.

## Gotchas worth knowing before you touch the build

- **Do not add a `postinstall` script.** `createMDX` generates `.source` during
  `next build`. A postinstall hook fires during `npm ci` in the Docker `deps`
  stage, where no content exists, and the CLI dies on a missing `vite`.
- **`next.config.ts` has a Turbopack workaround.** `fumadocs-mdx` puts a RegExp
  in its Turbopack rule conditions; Turbopack parses config as JSON and rejects
  it. The comment there explains why the fix looks the way it does — read it
  before "simplifying" that function.
- **The palette is duplicated** from `xpectra-web/app/globals.css` on purpose.
  See the comment at the top of `app/globals.css`.
