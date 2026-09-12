import Link from "next/link";

// Published runs: content/docs/memory-benchmark/{beam,index,longmemeval}.mdx.
// Keep sample sizes beside the scores; these are separate benchmark protocols.
export function BenchmarkResults() {
  return (
    <section
      id="benchmarks"
      aria-labelledby="benchmarks-title"
      className="km-section km-benchmarks scroll-mt-24"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="benchmarks-title" className="km-heading">
          Benchmark results
        </h2>
        <Link href="/docs/memory-benchmark" className="km-text-link">
          All results and methodology →
        </Link>
      </div>
      <div className="grid overflow-hidden rounded-2xl border border-fd-border lg:grid-cols-3">
        <article className="flex flex-col bg-fd-primary/5 p-6 sm:p-8">
          <h3 className="font-mono text-sm font-semibold">BEAM 100K</h3>
          <p className="km-benchmark-score text-fd-primary">73.3%</p>
          <p className="text-sm text-fd-muted-foreground">
            Accuracy · 400 probes · 20 conversations
          </p>
          <div
            className="mt-6 space-y-3"
            role="img"
            aria-label="BEAM 100K accuracy on the same 400 probes: Kimetsu with graph retrieval, 73.3 percent; flat retrieval baseline, 62.3 percent. Bars use a zero to 100 percent scale."
          >
            <div aria-hidden>
              <p className="mb-2 text-xs font-medium">
                Kimetsu · graph retrieval
              </p>
              <div className="h-2 rounded-full bg-fd-primary/10">
                <div className="h-full w-[73.3%] rounded-full bg-fd-primary" />
              </div>
            </div>
            <div aria-hidden>
              <div className="mb-2 flex justify-between gap-3 text-xs text-fd-muted-foreground">
                <span>Flat retrieval baseline</span>
                <span className="font-mono tabular-nums">62.3%</span>
              </div>
              <div className="h-2 rounded-full bg-fd-primary/10">
                <div className="h-full w-[62.3%] rounded-full bg-fd-muted-foreground" />
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-fd-muted-foreground">
            Both runs use the same test set.
          </p>
          <Link
            href="/docs/memory-benchmark/beam"
            className="km-text-link mt-auto pt-6"
          >
            BEAM test settings →
          </Link>
        </article>
        <article className="flex flex-col border-t border-fd-border p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <h3 className="font-mono text-sm font-semibold">LoCoMo</h3>
          <p className="km-benchmark-score">89.4%</p>
          <p className="text-sm text-fd-muted-foreground">
            Accuracy · 1,540 questions
          </p>
          <p className="mt-6 text-sm leading-6 text-fd-muted-foreground">
            Questions about facts, events, and relationships across long
            conversations.
          </p>
          <Link
            href="/docs/memory-benchmark/comparison"
            className="km-text-link mt-auto pt-6"
          >
            LoCoMo results and comparison →
          </Link>
        </article>
        <article className="flex flex-col border-t border-fd-border p-6 sm:p-8 lg:border-t-0 lg:border-l">
          <h3 className="font-mono text-sm font-semibold">LongMemEval S</h3>
          <p className="km-benchmark-score">83.0%</p>
          <p className="text-sm text-fd-muted-foreground">
            Accuracy · 200-question stratified slice
          </p>
          <p className="mt-6 text-sm leading-6 text-fd-muted-foreground">
            Sampled from the 500-question set, covering recall, changed facts,
            and reasoning across sessions.
          </p>
          <Link
            href="/docs/memory-benchmark/longmemeval"
            className="km-text-link mt-auto pt-6"
          >
            LongMemEval test settings →
          </Link>
        </article>
      </div>
      <p className="mt-4 max-w-4xl text-xs leading-5 text-fd-muted-foreground">
        Historical results from the linked runs. An LLM answers and grades the
        questions; the memory pipeline uses local search, embeddings, and
        reranking, with no LLM calls.
      </p>
    </section>
  );
}
