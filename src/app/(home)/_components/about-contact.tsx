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
            <p className="km-eyebrow">About</p>
            <h2 id="about-title" className="km-heading">
              Built for the next session.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-fd-muted-foreground">
              Kimetsu is an open-source project created by{" "}
              <span className="font-medium text-fd-foreground">
                Rodrigo Córdoba
              </span>
              . It gives coding agents a local place to keep project decisions,
              conventions, and fixes, so useful knowledge carries across
              sessions.
            </p>
            <p className="mt-4 leading-7 text-fd-muted-foreground">
              Built in Rust and backed by SQLite, Kimetsu works alongside the
              tools you already use. The source, documentation, and benchmarks
              are public, so you can inspect how it works and make it your own.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <a href={links.github} className="km-text-link">
                Explore the source →
              </a>
              <Link href="/docs" className="km-text-link">
                Read the documentation →
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
            <p className="km-eyebrow">Contact</p>
            <h2 id="contact-title" className="km-heading">
              Let’s talk about Kimetsu.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-fd-muted-foreground">
              Have a question, an idea, or something you’d like to build
              together? Get in touch with Rodrigo on LinkedIn.
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
