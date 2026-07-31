import defaultComponents from "fumadocs-ui/mdx";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import type { MDXComponents } from "mdx/types";
import { Endpoint } from "@/components/endpoint";

/**
 * MDX components available to every page.
 *
 * Everything below `defaultComponents` ships inside `fumadocs-ui` but is not
 * registered by default, and an unregistered component renders as *nothing* —
 * no error, no fallback, no console warning. A `<Steps>` block that silently
 * erases its own contents is the kind of failure that survives review, so the
 * rule is: register it here first, then use it.
 *
 * Styling needs no extra work — `app/globals.css` has `@source` over
 * `fumadocs-ui/dist`, so Tailwind already scans these components' classes.
 *
 * Kept as a function rather than a module-level object so pages can be given
 * extra components later without every call site changing.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Accordion,
    Accordions,
    Endpoint,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components,
  };
}
