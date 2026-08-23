import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
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
    githubUrl: links.github,
    links: [
      {
        text: "Projects",
        url: "/projects",
        active: "nested-url",
      },
      {
        text: "Docs",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "crates.io",
        url: links.crates,
        external: true,
      },
      {
        text: "npm",
        url: links.npm,
        external: true,
      },
    ],
  };
}
