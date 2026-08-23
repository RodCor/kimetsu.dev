const CLIENT_FAMILIES = Object.freeze([
  ["sidequest-discovery-monitor/", "synthetic-monitor"],
  ["googlebot", "google"],
  ["google-inspectiontool", "google"],
  ["bingbot", "microsoft"],
  ["oai-searchbot", "openai"],
  ["gptbot", "openai"],
  ["chatgpt-user", "openai"],
  ["claudebot", "anthropic"],
  ["claude-web", "anthropic"],
  ["perplexitybot", "perplexity"],
  ["amazonbot", "amazon"],
  ["bytespider", "bytedance"],
  ["github-copilot", "github"],
  ["curl/", "command-line"],
  ["wget/", "command-line"],
  ["python-requests/", "script"],
  ["undici", "script"],
]);

const AUTOMATION_MARKERS = Object.freeze([
  "agent",
  "bot",
  "crawler",
  "fetch",
  "httpclient",
  "spider",
]);

const SITE_ROUTES = new Map([
  ["/robots.txt", ["/robots.txt", "discovery"]],
  ["/sitemap.xml", ["/sitemap.xml", "discovery"]],
  ["/llms.txt", ["/llms.txt", "discovery"]],
  ["/llms-full.txt", ["/llms-full.txt", "discovery"]],
  ["/agent-gateway.json", ["/agent-gateway.json", "discovery"]],
  [
    "/.well-known/kimetsu-agents.json",
    ["/.well-known/kimetsu-agents.json", "discovery"],
  ],
  [
    "/well-known/kimetsu-agents.json",
    ["/well-known/kimetsu-agents.json", "discovery"],
  ],
  ["/projects", ["/projects/", "inspection"]],
  ["/projects/", ["/projects/", "inspection"]],
]);

const GATEWAY_ROUTES = new Map([
  ["/", ["/", "discovery"]],
  ["/agent-gateway.json", ["/agent-gateway.json", "discovery"]],
  [
    "/.well-known/kimetsu-agents.json",
    ["/.well-known/kimetsu-agents.json", "discovery"],
  ],
  [
    "/.well-known/agent-card.json",
    ["/.well-known/agent-card.json", "discovery"],
  ],
  ["/.well-known/agent.json", ["/.well-known/agent.json", "discovery"]],
  ["/a2a/sidequest", ["/a2a/sidequest", "engagement"]],
  ["/v1/projects", ["/v1/projects", "inspection"]],
  ["/v1/sidequest", ["/v1/sidequest", "inspection"]],
  ["/v1/sidequest/proposals", ["/v1/sidequest/proposals", "engagement"]],
  ["/v1/sidequest/winners", ["/v1/sidequest/winners", "engagement"]],
  ["/v1/sidequest/agents", ["/v1/sidequest/agents", "engagement"]],
  ["/health", ["/health", "operational"]],
]);

function verifiedBot(request) {
  return request.cf?.botManagement?.verifiedBot === true;
}

function countryCode(request) {
  const country = request.cf?.country;
  return typeof country === "string" && /^[A-Z]{2}$/.test(country)
    ? country
    : "unknown";
}

export function classifyClient(request) {
  const userAgent = (request.headers.get("user-agent") ?? "").toLowerCase();

  for (const [marker, family] of CLIENT_FAMILIES) {
    if (userAgent.includes(marker)) return family;
  }

  if (verifiedBot(request)) return "verified-bot";
  if (AUTOMATION_MARKERS.some((marker) => userAgent.includes(marker))) {
    return "unverified-automation";
  }
  return userAgent ? "browser-or-unknown" : "unknown";
}

export function classifySiteRoute(pathname) {
  return SITE_ROUTES.get(pathname) ?? ["other", "other"];
}

export function classifyGatewayRoute(pathname) {
  return GATEWAY_ROUTES.get(pathname) ?? ["other", "rejected"];
}

export function emitRequestTelemetry({
  request,
  response,
  service,
  route,
  stage,
  logger = console.log,
}) {
  const method = ["GET", "HEAD", "OPTIONS", "POST"].includes(request.method)
    ? request.method
    : "OTHER";

  logger(
    JSON.stringify({
      event: "kimetsu.discovery.request",
      schema_version: 1,
      service,
      stage,
      route,
      method,
      status: response.status,
      client_family: classifyClient(request),
      verified_bot: verifiedBot(request),
      country: countryCode(request),
    }),
  );
}
