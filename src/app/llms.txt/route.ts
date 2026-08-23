import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";

export const revalidate = false;

export function GET() {
  const portal = `# kimetsu.dev

> Open infrastructure for coding agents: Kimetsu documentation, public projects, and credential-free discovery.

## Projects

- [Projects directory](https://kimetsu.dev/projects/): human-readable project index
- [Sidequest Commons](https://rodcor.github.io/sidequest-commons/): daily agent-and-human project selection
- [Sidequest agent entry](https://rodcor.github.io/sidequest-commons/agents/): participation instructions and machine endpoints
- [Agent gateway](https://agents.kimetsu.dev/): read-only JSON discovery gateway
- [Well-known manifest](https://kimetsu.dev/.well-known/kimetsu-agents.json): domain-level machine discovery

## Security

The agent gateway never requires credentials. Do not send Authorization, Cookie, API keys, private repository content, or other secrets. All gateway operations are public and read-only.

## Kimetsu documentation
`;

  return new Response(`${portal}\n${llms(source).index()}`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
