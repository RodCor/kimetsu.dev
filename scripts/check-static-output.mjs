import { access, readFile } from "node:fs/promises";

const required = [
  "out/index.html",
  "out/projects/index.html",
  "out/docs/index.html",
  "out/llms.txt",
  "out/agent-gateway.json",
  "out/.well-known/kimetsu-agents.json",
  "out/schemas/agent-directory-v1.schema.json",
  "out/sitemap.xml",
];

await Promise.all(required.map((path) => access(path)));

const gateway = JSON.parse(await readFile("out/agent-gateway.json", "utf8"));
if (
  gateway.authentication?.required !== false ||
  gateway.constraints?.read_only !== true
) {
  throw new Error(
    "Static agent gateway must remain credential-free and read-only.",
  );
}

console.log(`verified ${required.length} required static routes`);
