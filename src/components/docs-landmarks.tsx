"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

// The mobile contents control is a <header> inside the TOC popover. Fumadocs
// has no prop for that element. A header stays a banner landmark unless its
// own role changes, so this sets role="group" after each client navigation.
// usePathname() is the dependency because the docs layout stays mounted while
// the page swaps; an empty dependency list would leave the next page's header
// unlabeled.
export function DocsLandmarks() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!pathname.startsWith("/docs")) return;
    for (const header of document.querySelectorAll("#nd-docs-layout header")) {
      if (header.id === "nd-subnav") continue;
      header.setAttribute("role", "group");
    }
  }, [pathname]);

  return null;
}
