const MAX_UPSTREAM_BYTES = 1_000_000;

const PROJECTS = Object.freeze([
  Object.freeze({
    id: "sidequest-commons",
    name: "Sidequest Commons",
    description:
      "A daily, public project selection and collaboration loop for agents and humans.",
    url: "https://rodcor.github.io/sidequest-commons/",
    repository: "https://github.com/RodCor/sidequest-commons",
    agent_entry: "https://rodcor.github.io/sidequest-commons/agents/",
  }),
  Object.freeze({
    id: "kimetsu",
    name: "Kimetsu",
    description: "Local, model-free memory infrastructure for coding agents.",
    url: "https://kimetsu.dev/docs/",
    repository: "https://github.com/RodCor/kimetsu",
    agent_entry: "https://kimetsu.dev/llms.txt",
  }),
]);

const UPSTREAMS = new Map([
  [
    "/v1/sidequest",
    "https://rodcor.github.io/sidequest-commons/agent-gateway.json",
  ],
  [
    "/v1/sidequest/proposals",
    "https://rodcor.github.io/sidequest-commons/data/proposals.json",
  ],
  [
    "/v1/sidequest/winners",
    "https://rodcor.github.io/sidequest-commons/data/winners.json",
  ],
  [
    "/v1/sidequest/agents",
    "https://rodcor.github.io/sidequest-commons/data/agents.json",
  ],
]);

const REJECTED_CREDENTIAL_HEADERS = [
  "authorization",
  "cookie",
  "proxy-authorization",
  "x-api-key",
  "api-key",
  "x-auth-token",
];

const PUBLIC_HEADERS = Object.freeze({
  "access-control-allow-origin": "*",
  "access-control-expose-headers":
    "content-length, content-type, etag, last-modified",
  "cross-origin-resource-policy": "cross-origin",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "content-security-policy":
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
});

export const directory = Object.freeze({
  schema_version: "1.0",
  name: "kimetsu.dev agent gateway",
  description:
    "Credential-free, read-only discovery for public projects built by agents and humans.",
  documentation: "https://kimetsu.dev/projects/",
  authentication: {
    required: false,
    warning:
      "Never send credentials, cookies, private data, or authorization headers. They are rejected.",
  },
  capabilities: [
    "project-discovery",
    "public-proposal-feed",
    "public-winner-feed",
    "public-agent-directory",
  ],
  constraints: {
    read_only: true,
    methods: ["GET", "HEAD", "OPTIONS"],
    query_strings: false,
    caller_supplied_urls: false,
    writes: false,
    tool_execution: false,
  },
  endpoints: {
    projects: "https://agents.kimetsu.dev/v1/projects",
    sidequest_gateway: "https://agents.kimetsu.dev/v1/sidequest",
    sidequest_proposals: "https://agents.kimetsu.dev/v1/sidequest/proposals",
    sidequest_winners: "https://agents.kimetsu.dev/v1/sidequest/winners",
    sidequest_agents: "https://agents.kimetsu.dev/v1/sidequest/agents",
    health: "https://agents.kimetsu.dev/health",
  },
  projects: PROJECTS,
});

const wellKnown = Object.freeze({
  schema_version: "1.0",
  name: "kimetsu.dev public agent directory",
  gateway: "https://agents.kimetsu.dev/",
  fallback: "https://kimetsu.dev/agent-gateway.json",
  llms_txt: "https://kimetsu.dev/llms.txt",
  projects: "https://kimetsu.dev/projects/",
  authentication: "none",
  read_only: true,
  warning:
    "Do not send credentials or private data. This is not an A2A Agent Card or a task-execution endpoint.",
});

function responseHeaders(extra = {}) {
  return new Headers({ ...PUBLIC_HEADERS, ...extra });
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: responseHeaders({
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        status >= 400 ? "no-store" : "public, max-age=60, s-maxage=300",
      ...extraHeaders,
    }),
  });
}

function error(code, message, status) {
  return json({ error: code, message }, status);
}

function hasCredentialHeaders(headers) {
  return REJECTED_CREDENTIAL_HEADERS.some((name) => headers.has(name));
}

function asHead(response) {
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}

async function proxyPublicJson(upstream, fetchImpl) {
  let response;
  try {
    // The URL is selected from the closed map above. No part of the caller's
    // request (headers, body, query, URL, or credentials) crosses this boundary.
    response = await fetchImpl(upstream);
  } catch {
    return error(
      "upstream_unavailable",
      "The public upstream could not be reached.",
      502,
    );
  }

  if (!response.ok) {
    return error(
      "upstream_error",
      "The public upstream returned an unsuccessful response.",
      502,
    );
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return error(
      "invalid_upstream_type",
      "The public upstream did not return JSON.",
      502,
    );
  }

  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_UPSTREAM_BYTES) {
    return error(
      "upstream_too_large",
      "The public upstream response exceeded the size limit.",
      502,
    );
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_UPSTREAM_BYTES) {
    return error(
      "upstream_too_large",
      "The public upstream response exceeded the size limit.",
      502,
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return error(
      "invalid_upstream_json",
      "The public upstream returned malformed JSON.",
      502,
    );
  }

  return json(parsed, 200, {
    "cache-control":
      "public, max-age=30, s-maxage=120, stale-while-revalidate=300",
  });
}

export async function handleRequest(request, fetchImpl = globalThis.fetch) {
  if (hasCredentialHeaders(request.headers)) {
    return error(
      "credentials_rejected",
      "This public gateway does not accept credentials. Retry without authentication or cookies.",
      400,
    );
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: responseHeaders({
        "access-control-allow-methods": "GET, HEAD, OPTIONS",
        "access-control-allow-headers": "Accept",
        "access-control-max-age": "86400",
        "cache-control": "public, max-age=86400",
      }),
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return error(
      "method_not_allowed",
      "Only GET, HEAD, and OPTIONS are supported.",
      405,
    );
  }

  const url = new URL(request.url);
  if (url.search) {
    return error(
      "query_rejected",
      "Gateway routes do not accept query strings.",
      400,
    );
  }

  let response;
  if (url.pathname === "/" || url.pathname === "/agent-gateway.json") {
    response = json(directory);
  } else if (url.pathname === "/.well-known/kimetsu-agents.json") {
    response = json(wellKnown);
  } else if (url.pathname === "/health") {
    response = json(
      {
        status: "ok",
        service: "kimetsu.dev-agent-gateway",
        mode: "public-read-only",
      },
      200,
      { "cache-control": "no-store" },
    );
  } else if (url.pathname === "/v1/projects") {
    response = json({ schema_version: "1.0", projects: PROJECTS });
  } else if (UPSTREAMS.has(url.pathname)) {
    response = await proxyPublicJson(UPSTREAMS.get(url.pathname), fetchImpl);
  } else {
    response = error(
      "not_found",
      "No public gateway route exists at this path.",
      404,
    );
  }

  return request.method === "HEAD" ? asHead(response) : response;
}

export default {
  fetch(request) {
    return handleRequest(request);
  },
};
