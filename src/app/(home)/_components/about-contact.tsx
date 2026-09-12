import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/shared";

export function AboutContact() {
  return (
    <>
      <section
        id="about"
        aria-labelledby="about-title"
        className="km-section scroll-mt-24"
      >
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 id="about-title" className="km-heading">
              About Kimetsu
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-fd-muted-foreground">
              Created and maintained by{" "}
              <span className="font-medium text-fd-foreground">
                Rodrigo Córdoba
              </span>
              . Written in Rust and released under the MIT and Apache-2.0
              licenses.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <a href={links.github} className="km-text-link">
                Source code →
              </a>
              <Link href="/projects" className="km-text-link">
                Related projects →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="km-section scroll-mt-24"
      >
        <div className="grid items-center gap-8 rounded-2xl border border-fd-border bg-fd-card/40 p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 id="contact-title" className="km-heading">
              Contact
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-fd-muted-foreground">
              For questions, feedback, or collaboration, contact Rodrigo on
              LinkedIn.
            </p>
          </div>
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn with Rodrigo Córdoba (opens in a new tab)"
            className="km-button-primary justify-self-start"
          >
            Connect on LinkedIn
            <ArrowUpRight className="size-4 shrink-0" aria-hidden />
          </a>
        </div>
      </section>
    </>
  );
}
