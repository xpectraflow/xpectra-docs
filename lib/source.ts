import { loader } from "fumadocs-core/source";
import { docs } from "@/.source/server";

/**
 * The page tree and content loader.
 *
 * `baseUrl: "/"` is the whole reason this app was split out of the console.
 * While the docs lived at `xpectra-web/app/docs`, Fumadocs generated every
 * internal href from a base of `/docs`, which forced docs.xpectraflow.com to
 * `redir / /docs` and made real URLs read `/docs/authentication`. A rewrite
 * would have produced `/docs/docs/…` instead. Serving from a root of its own
 * removes the constraint entirely: the page at content/authentication.mdx is
 * simply docs.xpectraflow.com/authentication.
 */
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});
