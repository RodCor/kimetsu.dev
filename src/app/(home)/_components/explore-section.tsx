import { Database, MessageSquare, Search } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Database,
    title: "Keep the useful lesson",
    body: "Save a project convention, a decision, or the command that finally worked. Memories live in your project’s SQLite database.",
  },
  {
    icon: Search,
    title: "Recall it in context",
    body: "Search by words or meaning. Kimetsu selects relevant memories within a delivery budget and brings them into the next task.",
  },
  {
    icon: MessageSquare,
    title: "Learn from the outcome",
    body: "Citations and feedback help track which memories contributed. Corrections and lifecycle rules keep old advice from outliving its usefulness.",
  },
];

export function ExploreSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="workflow-title"
      className="km-section scroll-mt-24"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <p className="km-eyebrow">Across sessions, across agents</p>
          <h2 id="workflow-title" className="km-heading">
            The useful part of yesterday, ready today.
          </h2>
        </div>
        <Link href="/docs/how-kimetsu-works" className="km-text-link">
          Inside the memory loop →
        </Link>
      </div>
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-fd-border pt-6">
            <div className="mb-5 flex items-center justify-between">
              <step.icon className="size-6 text-fd-primary" aria-hidden />
              <span className="font-mono text-sm text-fd-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
            <p className="text-sm leading-6 text-fd-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-col justify-between gap-4 rounded-xl border border-fd-border bg-fd-card p-5 sm:flex-row sm:items-center">
        <p className="max-w-2xl text-sm leading-6 text-fd-muted-foreground">
          <strong className="text-fd-foreground">
            Choose your compute budget.
          </strong>{" "}
          Start with lexical search. Add local embeddings and reranking when
          your workload benefits from them. Delivered context still uses your
          agent’s tokens.
        </p>
        <Link
          href="/docs/how-kimetsu-works/retrieval-models"
          className="km-text-link shrink-0"
        >
          Compare retrieval models →
        </Link>
      </div>
    </section>
  );
}
