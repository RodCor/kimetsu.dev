import assert from "node:assert/strict";

const MAX_RESPONSE_BYTES = 1_000_000;
const USER_AGENT =
  "Sidequest-Discovery-Monitor/1.0 (+https://kimetsu.dev/projects/)";

const configuredOrigin = new URL(
  process.env.DISCOVERY_ORIGIN ?? "https://kimetsu.dev",
);
if (
  configuredOrigin.protocol !== "https:" ||
  !["kimetsu.dev", "preview.kimetsu.dev"].includes(configuredOrigin.hostname)
) {
  throw new Error("DISCOVERY_ORIGIN must be an approved kimetsu.dev hostname.");
}
const origin = configuredOrigin.origin;

async function readLimitedText(response) {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
    throw new Error(`Response exceeded ${MAX_RESPONSE_BYTES} bytes.`);
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error(`Response exceeded ${MAX_RESPONSE_BYTES} bytes.`);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function get(url) {
  const response = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, 200, `${url} returned ${response.status}`);
  return readLimitedText(response);
}

async function getJson(url) {
  const text = await get(url);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${url} did not return valid JSON.`);
  }
}

const robots = await get(`${origin}/robots.txt`);
assert.match(robots, /Sitemap: https:\/\/kimetsu\.dev\/sitemap\.xml/);
assert.match(robots, /https:\/\/kimetsu\.dev\/llms\.txt/);
assert.match(robots, /well-known\/kimetsu-agents\.json/);

const sitemap = await get(`${origin}/sitemap.xml`);
assert.match(sitemap, /<loc>https:\/\/kimetsu\.dev\/projects\/<\/loc>/);

const llms = await get(`${origin}/llms.txt`);
assert.match(llms, /Sidequest Commons/i);
assert.match(llms, /https:\/\/agents\.kimetsu\.dev\//);

const staticGateway = await getJson(`${origin}/agent-gateway.json`);
assert.equal(staticGateway.authentication?.required, false);
assert.equal(staticGateway.constraints?.read_only, true);
assert.ok(
  staticGateway.projects?.some(({ id }) => id === "sidequest-commons"),
  "Static directory did not include Sidequest Commons.",
);

const rootDirectory = await getJson(
  `${origin}/.well-known/kimetsu-agents.json`,
);
assert.equal(rootDirectory.gateway, "https://agents.kimetsu.dev/");

const agentDirectory = await getJson(
  "https://agents.kimetsu.dev/.well-known/kimetsu-agents.json",
);
assert.equal(agentDirectory.read_only, true);

const gateway = await getJson("https://agents.kimetsu.dev/v1/sidequest");
assert.equal(typeof gateway, "object");
await Promise.all(
  ["proposals", "winners", "agents"].map((feed) =>
    getJson(`https://agents.kimetsu.dev/v1/sidequest/${feed}`),
  ),
);

console.log(
  `verified the Sidequest discovery chain through ${configuredOrigin.hostname}`,
);
