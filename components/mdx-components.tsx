import defaultComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

/**
 * MDX components available to every page.
 *
 * Kept as a single function rather than a module-level object so pages can be
 * given extra components later without every call site changing.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}
