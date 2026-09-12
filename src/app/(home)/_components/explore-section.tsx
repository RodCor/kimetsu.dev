import Link from "next/link";

const steps = [
  {
    title: "Store",
    body: "Memories live in a SQLite database in your project. No hosted memory account is required.",
  },
  {
    title: "Retrieve",
    body: "Start with keyword search. Add local embeddings and reranking for semantic search. Set a token budget for the context sent to your agent.",
  },
  {
    title: "Update",
    body: "Track changed facts and suppress outdated results. Export and import memories to move them between machines.",
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
        <h2 id="workflow-title" className="km-heading">
          How it works
        </h2>
        <Link href="/docs/how-kimetsu-works" className="km-text-link">
          Technical documentation →
        </Link>
      </div>
      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-fd-border pt-6">
            <span
              className="mb-4 block font-mono text-sm text-fd-primary"
              aria-hidden
            >
              0{index + 1}
            </span>
            <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
            <p className="text-sm leading-6 text-fd-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
