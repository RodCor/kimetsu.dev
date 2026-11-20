"use client";

import { useLayoutEffect } from "react";

function headingText(heading: Element) {
  return (heading.textContent ?? "")
    .replaceAll("Copy Anchor Link", "")
    .replace(/\s+/g, " ")
    .trim();
}

export function DocsLandmarks() {
  useLayoutEffect(() => {
    const page = document.getElementById("nd-page");
    if (page) page.setAttribute("role", "main");

    const pageToc = document.getElementById("nd-toc");
    if (pageToc && !pageToc.getAttribute("role")) {
      pageToc.setAttribute("role", "navigation");
      pageToc.setAttribute("aria-label", "On this page");
    }

    for (const header of document.querySelectorAll("#nd-docs-layout header")) {
      if (header.id === "nd-subnav") continue;
      header.setAttribute("role", "group");
      const toc = header.parentElement;
      if (!toc || toc.getAttribute("role")) continue;
      toc.setAttribute("role", "navigation");
      toc.setAttribute("aria-label", "Page sections");
    }

    const seen = new Map<string, number>();
    for (const region of document.querySelectorAll(
      '#nd-page [role="region"]',
    )) {
      if (
        region.getAttribute("aria-label") ||
        region.getAttribute("aria-labelledby")
      ) {
        continue;
      }
      let heading: Element | null = null;
      let node: Element | null = region.closest("figure");
      while (node?.previousElementSibling) {
        const previous = node.previousElementSibling;
        if (/^H[1-6]$/.test(previous.tagName)) {
          heading = previous;
          break;
        }
        node = previous;
      }
      const base = heading ? `${headingText(heading)} sample` : "Code sample";
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      region.setAttribute(
        "aria-label",
        count === 1 ? base : `${base} ${count}`,
      );
    }
  }, []);

  return null;
}
