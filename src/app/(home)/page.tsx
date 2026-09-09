import { ArrowRight, Database, GitBranch, Lock, Terminal } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/shared";
import { ExploreSection } from "./_components/explore-section";
import { BrainSharing } from "./_components/home-visuals";
import { ProjectsSection } from "./_components/projects-section";
import { QuickStart } from "./_components/quick-start";

const principles = [
  {
    icon: Database,
    title: "Local by default",
    body: "Project memory lives in SQLite. Start with lexical search or add local semantic models.",
  },
  {
    icon: GitBranch,
    title: "Portable knowledge",
    body: "Keep project decisions with the project. Export and import memories when you change machines or collaborate.",
  },
  {
    icon: Lock,
    title: "No hosted memory account",
    body: "The local memory path needs no cloud service or memory API key. Your agent keeps using its own provider.",
  },
];

const questions = [
  {
    question: "Does remembering really cost zero tokens?",
    answer:
      "Local storage and lexical retrieval need no LLM calls. Local embeddings and reranking use your machine’s compute. Memory delivered to an agent still consumes context tokens; optional answer generation and model-assisted harvesting have separate costs.",
  },
  {
    question: "Can I use it offline?",
    answer:
      "Local memory works offline. Installation and the first download of optional models need a connection. Whether the rest of your session works offline depends on the agent and model you use.",
  },
  {
    question: "Which agents can use it?",
    answer:
      "Setup supports Claude Code, Codex, Cursor, Pi, and OpenClaw. Integration behavior varies: Cursor uses MCP and guidance rather than automatic prompt hooks. The installation guide covers each host.",
  },
  {
    question: "What do the new benchmark numbers prove?",
    answer:
      "They measure delivery of stored evidence on a frozen synthetic fixture. They do not measure whether an agent gives a correct final answer. The v2.8.0 structured-fact guard is opt-in, and compound questions can still miss an attribute.",
  },
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="km-home flex-1">
      <section className="km-hero">
        <div className="km-hero-grid">
          <div className="min-w-0">
            <p className="km-eyebrow">
              <span
                className="mr-2 inline-block size-2 rounded-full bg-fd-primary"
                aria-hidden
              />
              Local memory for coding agents
            </p>
            <h1 className="max-w-2xl font-mono text-[2.65rem] leading-[1.12] font-semibold tracking-[-0.055em] sm:text-6xl">
              Your next session starts with what you learned.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-fd-muted-foreground">
              Kimetsu remembers your project’s decisions, conventions, and
              fixes, then brings relevant context into the next task. One Rust
              binary, alongside the agent you already use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#get-started" className="km-button-primary">
                Install Kimetsu <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#how-it-works" className="km-button-secondary">
                See how it works
              </a>
            </div>
            <p className="mt-5 text-xs text-fd-muted-foreground">
              Open source · MIT / Apache-2.0 · Linux, macOS & Windows
            </p>
          </div>
          <figure
            className="km-memory-example min-w-0"
            aria-label="Illustrative memory workflow"
          >
            <div className="flex items-center justify-between gap-3 border-b border-fd-border px-5 py-4 text-xs text-fd-muted-foreground">
              <span className="inline-flex items-center gap-2 font-mono">
                <Terminal className="size-4" aria-hidden /> project / memory
              </span>
              <span>Illustrative workflow</span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-center gap-3 font-mono text-xs text-fd-muted-foreground">
                <span className="km-step">01</span> A lesson from this session
              </div>
              <p className="mt-4 text-lg leading-7">
                “Regenerate the API client after changing the schema.”
              </p>
              <div
                className="my-6 ml-4 h-8 border-l border-dashed border-fd-primary/60"
                aria-hidden
              />
              <div className="flex items-center gap-3 font-mono text-xs text-fd-muted-foreground">
                <span className="km-step">02</span> Context for the next task
              </div>
              <p className="mt-4 text-sm text-fd-muted-foreground">
                Your agent is about to edit the API.
              </p>
              <div className="mt-4 rounded-xl border border-fd-primary/30 bg-fd-primary/5 p-4">
                <p className="mb-2 text-xs font-semibold text-fd-primary">
                  Relevant project memory
                </p>
                <p className="text-sm leading-6">
                  After changing the schema, run{" "}
                  <code className="font-mono" translate="no">
                    npm run generate:api
                  </code>{" "}
                  and commit the generated client.
                </p>
              </div>
            </div>
            <div className="border-t border-fd-border px-5 py-4 text-xs text-fd-muted-foreground">
              Saved locally. Available across sessions.
            </div>
          </figure>
        </div>
      </section>
      <div className="border-y border-fd-border bg-fd-card/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-7 gap-y-3 px-6 py-5 text-sm">
          <span className="text-fd-muted-foreground">Works alongside</span>
          {["Claude Code", "Codex", "Cursor", "Pi", "OpenClaw"].map((host) => (
            <span key={host} className="font-mono font-medium">
              {host}
            </span>
          ))}
          <Link href="/docs/install" className="km-text-link">
            Host setup →
          </Link>
        </div>
      </div>
      <QuickStart />
      <ExploreSection />
      <section
        id="evidence"
        aria-labelledby="evidence-title"
        className="km-section scroll-mt-24"
      >
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="km-eyebrow">Measured, with the limits included</p>
            <h2 id="evidence-title" className="km-heading">
              Better memory knows when evidence is missing.
            </h2>
            <p className="mt-4 leading-7 text-fd-muted-foreground">
              The structured-answerability study for v2.8.0 reduced unwanted
              injections while preserving positive retrieval hits.
            </p>
            <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">
              45 synthetic cases, two repeats. Evidence delivery, not
              generated-answer accuracy. Exact metadata matched 36/45 cases in
              each repeat.
            </p>
            <Link
              href="/docs/memory-benchmark/answerability"
              className="km-text-link mt-5 inline-block"
            >
              Inspect the results and remaining gaps →
            </Link>
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fd-border p-5">
              <h3 className="font-semibold">Structured fact guard</h3>
              <span className="rounded-full border border-fd-border px-3 py-1 text-xs text-fd-muted-foreground">
                v2.8.0 · Opt-in
              </span>
            </div>
            <table className="w-full text-sm">
              <caption className="sr-only">
                Paired comparison on the frozen structured-answerability fixture
              </caption>
              <thead>
                <tr className="text-xs text-fd-muted-foreground">
                  <th scope="col" className="p-4 text-left font-medium">
                    Measure
                  </th>
                  <th scope="col" className="p-4 text-right font-medium">
                    Before
                  </th>
                  <th scope="col" className="p-4 text-right font-medium">
                    After
                  </th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {[
                  ["Unwanted injections ↓", "15/18", "3/18"],
                  ["Positive retrieval hits", "24/27", "24/27"],
                  ["Exact evidence metadata", "Not emitted", "36/45 (80%)"],
                  ["P95 latency", "376.6 ms", "386.6 ms"],
                  ["Mean response bytes", "613.5", "651.2"],
                ].map(([label, before, after]) => (
                  <tr key={label} className="border-t border-fd-border">
                    <th scope="row" className="p-4 text-left font-normal">
                      {label}
                    </th>
                    <td className="p-4 text-right text-fd-muted-foreground">
                      {before}
                    </td>
                    <td className="p-4 text-right font-medium">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-fd-border p-5 text-xs leading-5 text-fd-muted-foreground">
              80% fewer unwanted injections; p95 latency increased by about
              2.7%. This feature remains disabled by default. Measurements use
              the pre-release implementation; see the study for build
              fingerprints and publication status.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-fd-border pt-5 text-sm">
          <p className="text-fd-muted-foreground">
            Looking for LoCoMo, LongMemEval, or earlier BrainBench results?
          </p>
          <Link href="/docs/memory-benchmark" className="km-text-link">
            Browse all benchmarks →
          </Link>
        </div>
      </section>
      <section aria-labelledby="ownership-title" className="km-section">
        <p className="km-eyebrow">Small footprint, clear ownership</p>
        <h2 id="ownership-title" className="km-heading mb-8">
          Your project. Your memory.
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-fd-border p-6"
            >
              <item.icon aria-hidden className="mb-5 size-6 text-fd-primary" />
              <h3 className="mb-3 font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-fd-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>
      <BrainSharing />
      <section aria-labelledby="questions-title" className="km-section">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="km-eyebrow">Before you install</p>
            <h2 id="questions-title" className="km-heading">
              A few useful answers.
            </h2>
            <Link href="/docs" className="km-text-link mt-5 inline-block">
              Read the documentation →
            </Link>
          </div>
          <div>
            {questions.map((item) => (
              <details
                key={item.question}
                className="border-b border-fd-border py-5 first:border-t"
              >
                <summary className="cursor-pointer font-medium leading-6">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-fd-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <ProjectsSection />
      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-6 py-10 text-sm sm:flex-row">
        <p className="text-fd-muted-foreground">
          <span className="font-mono font-semibold text-fd-foreground">
            Kimetsu
          </span>{" "}
          · Knowledge that carries forward.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
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
    </main>
  );
}
