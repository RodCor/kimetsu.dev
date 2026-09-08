import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { GitFork } from "lucide-react";
import Image from "next/image";
import { appName, links } from "./shared";

// Assets live in public/ and are served under the GitHub Pages base path.
const BASE = "";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src={`${BASE}/kimetsu-logo.png`}
            alt="Kimetsu logo"
            width={24}
            height={24}
            style={{ borderRadius: 4 }}
          />
          <span style={{ fontWeight: 600 }}>{appName}</span>
        </>
      ),
    },
    links: [
      {
        type: "icon",
        label: "Kimetsu on GitHub",
        text: "GitHub",
        icon: <GitFork aria-hidden />,
        url: links.github,
        external: true,
      },
      {
        text: "Install",
        url: "/docs/install",
        active: "nested-url",
      },
      {
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "Benchmarks",
        url: "/docs/memory-benchmark",
        active: "nested-url",
      },
      {
        text: "Projects",
        url: "/projects",
        active: "nested-url",
      },
    ],
  };
}
