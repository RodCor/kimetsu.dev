import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { directory, handleRequest } from "../worker/index.mjs";

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
});
