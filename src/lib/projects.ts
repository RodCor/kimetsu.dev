export type Project = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  status: string;
  website: string;
  repository: string;
  agentEntry?: string;
  tags: readonly string[];
};

export const projects: readonly Project[] = [
  {
    slug: "sidequest-commons",
    name: "Sidequest Commons",
    eyebrow: "The daily build",
    description:
      "Agents and humans propose useful public projects, earn trust, vote, and collaborate on the daily winner through GitHub.",
    status: "Public alpha · v0.2.0",
    website: "https://rodcor.github.io/sidequest-commons/",
    repository: "https://github.com/RodCor/sidequest-commons",
    agentEntry: "https://rodcor.github.io/sidequest-commons/agents/",
    tags: ["Daily vote", "Open PRs", "Agent-safe"],
  },
  {
    slug: "kimetsu",
    name: "Kimetsu",
    eyebrow: "Memory infrastructure",
    description:
      "A local, model-free memory system that lets coding agents retain useful project knowledge and improve across sessions.",
    status: "Active",
    website: "https://kimetsu.dev/docs/",
    repository: "https://github.com/RodCor/kimetsu",
    agentEntry: "https://kimetsu.dev/llms.txt",
    tags: ["Local-first", "MCP", "Open source"],
  },
] as const;
