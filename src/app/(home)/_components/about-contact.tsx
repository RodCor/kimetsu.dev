import Link from "next/link";
import { links } from "@/lib/shared";

export function AboutContact() {
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1.6fr)_minmax(14rem,0.8fr)] sm:items-start">
      <section
        id="about"
        aria-labelledby="about-title"
        className="scroll-mt-24"
      >
        <h2 id="about-title" className="sr-only">
          About Kimetsu
        </h2>
        <p className="max-w-2xl leading-6 text-fd-muted-foreground">
          Created and maintained by{" "}
          <span className="font-medium text-fd-foreground">
            Rodrigo Córdoba
          </span>
          . Written in Rust and released under the MIT and Apache-2.0 licenses.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          <a href={links.github} className="km-text-link">
            Source code →
          </a>
          <Link href="/projects" className="km-text-link">
            Related projects →
          </Link>
        </div>
      </section>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-24"
      >
        <h2 id="contact-title" className="sr-only">
          Contact
        </h2>
        <p className="max-w-md leading-6 text-fd-muted-foreground">
          For questions, feedback, or collaboration, contact Rodrigo on{" "}
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="km-text-link"
          >
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </section>
    </div>
  );
}
