import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  LLMS_TEXT,
  OPENAPI_DOCUMENT,
  ROBOTS_TEXT,
} from "../worker/discovery-documents.mjs";
import {
  a2aAgentCardV1,
  directory,
  handleGatewayFetch,
  handleRequest,
} from "../worker/index.mjs";
import { handleSiteRequest } from "../worker/site.mjs";
import { classifyClient, classifyGatewayRoute } from "../worker/telemetry.mjs";

const gateway = (path = "/", init = {}) =>
  handleRequest(new Request(`https://agents.kimetsu.dev${path}`, init));

test("publishes a credential-free, read-only directory", async () => {
  const response = await gateway();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "*");
  const body = await response.json();
  assert.equal(body.authentication.required, false);
  assert.equal(body.constraints.read_only, true);
  assert.equal(body.constraints.writes, false);
});

test("publishes honest agent-discovery documents", async () => {
  const llms = await gateway("/llms.txt");
  assert.equal(llms.status, 200);
  assert.match(llms.headers.get("content-type"), /^text\/plain/);
  assert.equal(
    llms.headers.get("cache-control"),
    "public, max-age=300, s-maxage=3600",
  );
  assert.equal(await llms.text(), LLMS_TEXT);
  assert.match(LLMS_TEXT, /^# Sidequest Commons Guide/m);
  assert.match(LLMS_TEXT, /\.well-known\/agent-card\.json/);
  assert.match(LLMS_TEXT, /Never send credentials/);

  const robots = await gateway("/robots.txt");
  assert.equal(robots.status, 200);
  assert.equal(await robots.text(), ROBOTS_TEXT);
  for (const crawler of [
    "GPTBot",
    "OAI-SearchBot",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
  ]) {
    assert.match(ROBOTS_TEXT, new RegExp(`User-agent: ${crawler}\\nAllow: /`));
  }

  const openapi = await gateway("/openapi.json");
  assert.equal(openapi.status, 200);
  assert.match(openapi.headers.get("content-type"), /^application\/json/);
  assert.deepEqual(await openapi.json(), OPENAPI_DOCUMENT);
  assert.equal(OPENAPI_DOCUMENT.openapi, "3.1.0");
  assert.deepEqual(OPENAPI_DOCUMENT.security, []);
  assert.equal(OPENAPI_DOCUMENT.servers[0].url, "https://agents.kimetsu.dev");
  assert.ok(OPENAPI_DOCUMENT.paths["/.well-known/agent-card.json"]);
  assert.ok(OPENAPI_DOCUMENT.paths["/a2a/sidequest"].post);
  assert.equal(OPENAPI_DOCUMENT.components.securitySchemes, undefined);
});

for (const path of ["/llms.txt", "/robots.txt", "/openapi.json"]) {
  test(`protects the discovery route ${path}`, async () => {
    const head = await gateway(path, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    assert.equal(head.headers.get("access-control-allow-origin"), "*");

    const preflight = await gateway(path, { method: "OPTIONS" });
    assert.equal(preflight.status, 204);
    assert.equal(
      preflight.headers.get("access-control-allow-methods"),
      "GET, HEAD, OPTIONS",
    );
    assert.equal(
      preflight.headers.get("access-control-allow-headers"),
      "Accept",
    );

    const write = await gateway(path, {
      method: "POST",
      body: "untrusted",
    });
    assert.equal(write.status, 405);

    const query = await gateway(`${path}?url=https://example.com`);
    assert.equal(query.status, 400);
    assert.equal((await query.json()).error, "query_rejected");

    const credential = await gateway(path, {
      headers: { authorization: "Bearer rejected-marker" },
    });
    assert.equal(credential.status, 400);
    assert.equal((await credential.json()).error, "credentials_rejected");
  });
}

for (const header of [
  "authorization",
  "cookie",
  "proxy-authorization",
  "x-api-key",
  "api-key",
  "x-auth-token",
]) {
  test(`rejects ${header}`, async () => {
    const response = await gateway("/", {
      headers: { [header]: "secret-value" },
    });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, "credentials_rejected");
  });
}

test("rejects write methods without reading a body", async () => {
  const response = await gateway("/", { method: "POST", body: "untrusted" });
  assert.equal(response.status, 405);
  assert.equal((await response.json()).error, "method_not_allowed");
});

test("rejects query strings", async () => {
  const response = await gateway("/v1/projects?url=https://example.com");
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "query_rejected");
});

test("answers a constrained CORS preflight", async () => {
  const response = await gateway("/", { method: "OPTIONS" });
  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-methods"),
    "GET, HEAD, OPTIONS",
  );
  assert.equal(response.headers.get("access-control-allow-headers"), "Accept");
});

test("answers an A2A preflight without allowing credential headers", async () => {
  const response = await gateway("/a2a/sidequest", { method: "OPTIONS" });
  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-methods"),
    "POST, OPTIONS",
  );
  assert.equal(
    response.headers.get("access-control-allow-headers"),
    "Content-Type, A2A-Version",
  );
});

test("publishes negotiated A2A v1 and default v0.3 Agent Cards", async () => {
  const v1 = await gateway("/.well-known/agent-card.json", {
    headers: { "a2a-version": "1.0" },
  });
  assert.equal(v1.status, 200);
  assert.equal(v1.headers.get("vary"), "A2A-Version");
  assert.deepEqual(await v1.json(), a2aAgentCardV1);

  const legacy = await gateway("/.well-known/agent-card.json");
  assert.equal(legacy.status, 200);
  assert.equal((await legacy.json()).protocolVersion, "0.3.0");
});

test("serves the legacy Agent Card path with canonical behavior", async () => {
  const v1 = await gateway("/.well-known/agent.json", {
    headers: { "a2a-version": "1.0" },
  });
  assert.equal(v1.status, 200);
  assert.equal(v1.headers.get("vary"), "A2A-Version");
  assert.equal(v1.headers.get("access-control-allow-origin"), "*");
  assert.deepEqual(await v1.json(), a2aAgentCardV1);

  const legacy = await gateway("/.well-known/agent.json");
  assert.equal(legacy.status, 200);
  assert.equal((await legacy.json()).protocolVersion, "0.3.0");

  const head = await gateway("/.well-known/agent.json", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const preflight = await gateway("/.well-known/agent.json", {
    method: "OPTIONS",
  });
  assert.equal(preflight.status, 204);
  assert.equal(
    preflight.headers.get("access-control-allow-headers"),
    "Accept, A2A-Version",
  );

  const write = await gateway("/.well-known/agent.json", {
    method: "POST",
    body: "untrusted",
  });
  assert.equal(write.status, 405);

  const query = await gateway("/.well-known/agent.json?source=untrusted");
  assert.equal(query.status, 400);
  assert.equal((await query.json()).error, "query_rejected");

  const credential = await gateway("/.well-known/agent.json", {
    headers: { authorization: "Bearer rejected-marker" },
  });
  assert.equal(credential.status, 400);
  assert.equal((await credential.json()).error, "credentials_rejected");
});

test("returns deterministic A2A v1 guidance without echoing caller text", async () => {
  const privateMarker = "github_pat_private_marker_123456789";
  const response = await gateway("/a2a/sidequest", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "a2a-version": "1.0",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "request-1",
      method: "SendMessage",
      params: {
        message: {
          messageId: "caller-message",
          role: "ROLE_USER",
          parts: [{ text: `How do I vote? ${privateMarker}` }],
        },
      },
    }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.id, "request-1");
  assert.equal(body.result.message.role, "ROLE_AGENT");
  assert.doesNotMatch(JSON.stringify(body), new RegExp(privateMarker));
  assert.match(body.result.message.parts[0].text, /rotate/i);
});

test("supports the default A2A v0.3 message method", async () => {
  const response = await gateway("/a2a/sidequest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 7,
      method: "message/send",
      params: {
        message: {
          kind: "message",
          messageId: "caller-message",
          role: "user",
          parts: [{ kind: "text", text: "Where are the proposals?" }],
        },
      },
    }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.id, 7);
  assert.equal(body.result.kind, "message");
  assert.equal(body.result.role, "agent");
  assert.match(body.result.parts[0].text, /proposal/i);
});

test("requires explicit version negotiation for A2A v1", async () => {
  const response = await gateway("/a2a/sidequest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 8,
      method: "SendMessage",
      params: {
        message: {
          messageId: "caller-message",
          role: "ROLE_USER",
          parts: [{ text: "Where are the proposals?" }],
        },
      },
    }),
  });
  assert.equal((await response.json()).error.code, -32009);
});

test("rejects malformed and unsupported A2A calls safely", async () => {
  const malformed = await gateway("/a2a/sidequest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal((await malformed.json()).error.code, -32700);

  const unsupported = await gateway("/a2a/sidequest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tasks/get" }),
  });
  assert.equal((await unsupported.json()).error.code, -32601);
});

test("rejects oversized A2A bodies before processing caller text", async () => {
  const response = await gateway("/a2a/sidequest", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "content-length": "16385",
    },
    body: "{}",
  });
  assert.equal(response.status, 413);
  assert.equal((await response.json()).error.code, -32600);
});

test("HEAD returns headers without a body", async () => {
  const response = await gateway("/v1/projects", { method: "HEAD" });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("proxy fetches only the hard-coded URL with fresh headers", async () => {
  let receivedUrl;
  let receivedInit;
  const response = await handleRequest(
    new Request("https://agents.kimetsu.dev/v1/sidequest/proposals", {
      headers: { "x-caller-context": "must-not-cross" },
    }),
    async (url, init) => {
      receivedUrl = url;
      receivedInit = init;
      return new Response('{"proposals":[]}', {
        headers: { "content-type": "application/json" },
      });
    },
  );
  assert.equal(response.status, 200);
  assert.equal(
    receivedUrl,
    "https://rodcor.github.io/sidequest-commons/data/proposals.json",
  );
  assert.equal(receivedInit, undefined);
});

test("rejects oversized and non-JSON upstream responses", async () => {
  const tooLarge = await handleRequest(
    new Request("https://agents.kimetsu.dev/v1/sidequest/winners"),
    async () =>
      new Response("{}", {
        headers: {
          "content-type": "application/json",
          "content-length": "1000001",
        },
      }),
  );
  assert.equal((await tooLarge.json()).error, "upstream_too_large");

  const html = await handleRequest(
    new Request("https://agents.kimetsu.dev/v1/sidequest/winners"),
    async () =>
      new Response("<html></html>", {
        headers: { "content-type": "text/html" },
      }),
  );
  assert.equal((await html.json()).error, "invalid_upstream_type");
});

test("static fallback and Worker agree on project IDs", async () => {
  const staticDirectory = JSON.parse(
    await readFile(
      new URL("../public/agent-gateway.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(
    staticDirectory.projects.map(({ id }) => id),
    directory.projects.map(({ id }) => id),
  );
  assert.deepEqual(staticDirectory.capabilities, directory.capabilities);
  assert.deepEqual(staticDirectory.constraints, directory.constraints);
  assert.deepEqual(staticDirectory.endpoints, directory.endpoints);
  assert.deepEqual(staticDirectory.registries, directory.registries);
});

test("telemetry classifies known clients without retaining user-agent text", () => {
  const request = new Request("https://agents.kimetsu.dev/v1/sidequest", {
    headers: { "user-agent": "OAI-SearchBot/1.0 private-marker" },
  });
  assert.equal(classifyClient(request), "openai");
  assert.deepEqual(classifyGatewayRoute("/v1/sidequest"), [
    "/v1/sidequest",
    "inspection",
  ]);
  assert.deepEqual(classifyGatewayRoute("/a2a/sidequest"), [
    "/a2a/sidequest",
    "engagement",
  ]);
  assert.deepEqual(classifyGatewayRoute("/.well-known/agent.json"), [
    "/.well-known/agent.json",
    "discovery",
  ]);
  assert.deepEqual(classifyGatewayRoute("/openapi.json"), [
    "/openapi.json",
    "discovery",
  ]);
});

test("gateway telemetry excludes credentials, queries, and unknown paths", async () => {
  const logs = [];
  const response = await handleGatewayFetch(
    new Request("https://agents.kimetsu.dev/not-a-route?token=query-secret", {
      headers: {
        authorization: "Bearer header-secret",
        "user-agent": "private-agent-marker",
      },
    }),
    globalThis.fetch,
    (entry) => logs.push(entry),
  );
  assert.equal(response.status, 400);
  assert.equal(logs.length, 1);
  const event = JSON.parse(logs[0]);
  assert.equal(event.route, "other");
  assert.equal(event.stage, "rejected");
  assert.equal(event.client_family, "unverified-automation");
  assert.doesNotMatch(
    logs[0],
    /header-secret|query-secret|private-agent-marker/,
  );
});

test("site Worker serves bound assets and emits one coarse event", async () => {
  const logs = [];
  const response = await handleSiteRequest(
    new Request("https://kimetsu.dev/llms.txt", {
      headers: { "user-agent": "Sidequest-Discovery-Monitor/1.0" },
    }),
    {
      fetch: async () =>
        new Response("# Kimetsu", {
          headers: { "content-type": "text/plain" },
        }),
    },
    (entry) => logs.push(entry),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "# Kimetsu");
  assert.equal(logs.length, 1);
  const event = JSON.parse(logs[0]);
  assert.equal(event.route, "/llms.txt");
  assert.equal(event.stage, "discovery");
  assert.equal(event.client_family, "synthetic-monitor");
});
