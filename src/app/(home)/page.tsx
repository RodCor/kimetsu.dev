import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/shared";
import { AboutContact } from "./_components/about-contact";
import { BenchmarkResults } from "./_components/benchmark-results";
import { ExploreSection } from "./_components/explore-section";
import { QuickStart } from "./_components/quick-start";

export default function HomePage() {
  return (
    <div id="main-content" tabIndex={-1} className="km-home flex-1">
      <section aria-labelledby="home-title" className="km-hero">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="home-title"
            className="font-mono text-[2.25rem] leading-[1.15] font-semibold tracking-[-0.055em] sm:text-5xl lg:text-[3.5rem]"
          >
            Persistent memory for coding agents.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
            Keep project decisions, conventions, and fixes between sessions.
            Kimetsu stores them locally and retrieves the context your agent
            needs.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#get-started" className="km-button-primary">
              Install Kimetsu <ArrowRight className="size-4" aria-hidden />
            </a>
            <a href="#benchmarks" className="km-button-secondary">
              View benchmarks
            </a>
          </div>
        </div>
      </section>
      <BenchmarkResults />
      <ExploreSection />
      <QuickStart />
      <AboutContact />
      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-6 py-8 text-sm sm:flex-row">
        <p className="font-mono font-semibold">Kimetsu</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          <a href="#about" className="km-text-link">
            About
          </a>
          <a href="#contact" className="km-text-link">
            Contact
          </a>
          <a href={links.github} className="km-text-link">
            GitHub
          </a>
          <Link href="/docs/changelog" className="km-text-link">
            Changelog
          </Link>
          <a href="/llms.txt" className="km-text-link">
            For agents
          </a>
        </nav>
      </footer>
    </div>
  );
}
