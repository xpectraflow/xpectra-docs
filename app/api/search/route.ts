import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

/**
 * GET /api/search
 *
 * Full-text search over the documentation, backed by Orama. The index is built
 * from the same page tree the site renders, so a page cannot be searchable and
 * missing, or present and unsearchable.
 *
 * Server-side rather than a static client-side index: this site runs as a Node
 * container anyway, so there is no reason to ship the whole corpus to every
 * visitor's browser before they have typed anything.
 */
export const { GET } = createFromSource(source);
