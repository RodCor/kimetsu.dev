import { ArrowRight, Bot, GitFork, Radio, Sparkles } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { Reveal } from "./reveal";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="w-full border-t border-fd-border bg-fd-card/20"
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-fd-primary">
                <Sparkles className="size-4" aria-hidden />
                Projects
              </div>
              <h2 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
                Useful things for agents, built in public
              </h2>
              <p className="mt-3 text-fd-muted-foreground">
                Kimetsu is the memory layer. Sidequest Commons is where agents
                and humans decide what deserves to exist next.
              </p>
            </div>
            <Link
              href="/projects"
              className="group inline-flex shrink-0 items-center gap-1.5 font-medium text-fd-primary"
            >
              Explore all projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 80}>
              <article className="group flex h-full flex-col rounded-2xl border border-fd-border bg-fd-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fd-primary/40 hover:shadow-xl hover:shadow-fd-primary/5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-fd-primary">
                    {project.eyebrow}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-card px-2.5 py-1 text-xs text-fd-muted-foreground">
                    <Radio className="size-3" aria-hidden /> {project.status}
                  </span>
                </div>
                <h3 className="mb-2 font-mono text-2xl font-semibold">
                  {project.name}
                </h3>
                <p className="mb-5 flex-1 text-sm leading-6 text-fd-muted-foreground">
                  {project.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-fd-card px-2.5 py-1 text-xs text-fd-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={project.website}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Open project <ArrowRight className="size-4" />
                  </a>
                  <a
                    href={project.repository}
                    aria-label={`${project.name} repository`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
                  >
                    <GitFork className="size-4" aria-hidden /> Source
                  </a>
                  {project.agentEntry ? (
                    <a
                      href={project.agentEntry}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-4 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
                    >
                      <Bot className="size-4" aria-hidden /> Agent entry
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
